import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@pensar/db"
import { uploadChatFile, getChatFileSignedUrl } from "@/lib/supabase-storage"
import { randomUUID } from "crypto"

const PAGE_SIZE = 50

function isChatTeam(value: unknown): value is "red" | "blue" {
    return value === "red" || value === "blue"
}

function detectFileType(mimeType: string): "IMAGE" | "AUDIO" | "DOCUMENT" {
    if (mimeType.startsWith("image/")) return "IMAGE"
    if (mimeType.startsWith("audio/")) return "AUDIO"
    return "DOCUMENT"
}

async function getUserRegistration(userId: string) {
    const debate = await prisma.debate.findFirst({
        where: { status: { in: ["LIVE", "SCHEDULED"] } },
        orderBy: { startAt: "asc" },
        select: { id: true },
    })
    if (!debate) return null

    return prisma.debateRegistration.findUnique({
        where: { userId_debateId: { userId, debateId: debate.id } },
        select: { team: true, debateId: true },
    })
}

async function getActiveBan(userId: string, debateId: string) {
    const ban = await prisma.chatBan.findUnique({
        where: { userId_debateId: { userId, debateId } },
        select: { expiresAt: true },
    })
    if (!ban) return null
    if (ban.expiresAt !== null && ban.expiresAt <= new Date()) {
        // Expired – clean up
        await prisma.chatBan.delete({
            where: { userId_debateId: { userId, debateId } },
        })
        return null
    }
    return ban
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    const registration = await getUserRegistration(userId)

    if (!registration || !isChatTeam(registration.team)) {
        return NextResponse.json(
            { error: "Solo miembros del equipo rojo o azul pueden usar el chat" },
            { status: 403 }
        )
    }

    const activeBan = await getActiveBan(userId, registration.debateId)
    if (activeBan) {
        return NextResponse.json(
            { error: "Tienes un baneo activo y no puedes enviar mensajes" },
            { status: 403 }
        )
    }

    let content = ""
    let fileUrl: string | null = null
    let fileType: "IMAGE" | "AUDIO" | "DOCUMENT" | null = null
    let fileName: string | null = null

    const contentType = request.headers.get("content-type") ?? ""

    if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData()
        content = String(formData.get("content") ?? "").trim()
        const file = formData.get("file") as File | null
        if (file && file.size > 0) {
            // 20 MB limit
            if (file.size > 20 * 1024 * 1024) {
                return NextResponse.json(
                    { error: "El archivo supera el límite de 20 MB" },
                    { status: 400 }
                )
            }
            const fileId = randomUUID()
            const storagePath = await uploadChatFile(
                file,
                registration.debateId,
                registration.team,
                fileId
            )
            fileUrl = await getChatFileSignedUrl(storagePath)
            fileType = detectFileType(file.type)
            fileName = file.name
        }
    } else {
        const body = await request.json().catch(() => ({}))
        content = String(body.content ?? "").trim()
    }

    if (!content && !fileUrl) {
        return NextResponse.json(
            { error: "El mensaje no puede estar vacío" },
            { status: 400 }
        )
    }

    // Sanitize: strip HTML tags to prevent XSS stored in the DB
    content = content.replace(/<[^>]*>/g, "")

    const message = await prisma.chatMessage.create({
        data: {
            debateId: registration.debateId,
            userId,
            team: registration.team,
            content,
            fileUrl,
            fileType,
            fileName,
        },
        include: {
            user: { select: { id: true, name: true, image: true } },
        },
    })

    return NextResponse.json({ ok: true, message }, { status: 201 })
}

export async function GET(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const debateId = searchParams.get("debateId")
    const team = searchParams.get("team")
    const cursor = searchParams.get("cursor") // createdAt ISO string

    if (!debateId || !isChatTeam(team)) {
        return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    const userId = session.user.id

    // Validate access: must be a registered member of this team (or admin)
    const isAdmin = session.user.role === "ADMIN"
    if (!isAdmin) {
        const reg = await prisma.debateRegistration.findUnique({
            where: { userId_debateId: { userId, debateId } },
            select: { team: true },
        })
        if (!reg || reg.team !== team) {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
        }
    }

    const messages = await prisma.chatMessage.findMany({
        where: {
            debateId,
            team: team as "red" | "blue",
            deleted: false,
            ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: PAGE_SIZE,
        include: {
            user: { select: { id: true, name: true, image: true } },
        },
    })

    const older = messages[messages.length - 1]
    const nextCursor = messages.length === PAGE_SIZE ? older?.createdAt.toISOString() : null

    return NextResponse.json({ messages: messages.reverse(), nextCursor })
}
