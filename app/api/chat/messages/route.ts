import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { and, desc, eq, lt } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { getHighlightedDebate } from "@/lib/debates"
import { db } from "@/lib/db"
import { chatBan, chatMessage, debateRegistration } from "@/lib/db/schema"
import { uploadChatFile, getChatFileSignedUrl } from "@/lib/supabase-storage"
import { randomUUID } from "crypto"
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit"

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
    const debate = await getHighlightedDebate()
    if (!debate) return null

    return db.query.debateRegistration.findFirst({
        where: and(
            eq(debateRegistration.userId, userId),
            eq(debateRegistration.debateId, debate.id)
        ),
        columns: { team: true, debateId: true },
    })
}

async function getActiveBan(userId: string, debateId: string) {
    const ban = await db.query.chatBan.findFirst({
        where: and(eq(chatBan.userId, userId), eq(chatBan.debateId, debateId)),
        columns: { expiresAt: true },
    })
    if (!ban) return null
    if (ban.expiresAt !== null && ban.expiresAt <= new Date()) {
        await db
            .delete(chatBan)
            .where(and(eq(chatBan.userId, userId), eq(chatBan.debateId, debateId)))
        return null
    }
    return ban
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    const ip = getClientIp(request)
    const sessionUserId = session?.user?.id ?? "anon"

    const rate = checkRateLimit({
        key: `chat_messages:post:${sessionUserId}:${ip}`,
        windowMs: 60 * 1000,
        limit: 20,
    })

    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes. Intenta más tarde." },
            {
                status: 429,
                headers:
                    rate.retryAfterMs !== null
                        ? { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) }
                        : undefined,
            }
        )
    }

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

    content = content.replace(/<[^>]*>/g, "")

    const messageId = crypto.randomUUID()
    const now = new Date()

    await db.insert(chatMessage).values({
        id: messageId,
        debateId: registration.debateId,
        userId,
        team: registration.team,
        content,
        fileUrl,
        fileType,
        fileName,
        createdAt: now,
        updatedAt: now,
    })

    const message = await db.query.chatMessage.findFirst({
        where: eq(chatMessage.id, messageId),
        with: {
            user: { columns: { id: true, name: true, image: true } },
        },
    })

    return NextResponse.json({ ok: true, message }, { status: 201 })
}

export async function GET(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    const ip = getClientIp(request)
    const sessionUserId = session?.user?.id ?? "anon"

    const rate = checkRateLimit({
        key: `chat_messages:get:${sessionUserId}:${ip}`,
        windowMs: 60 * 1000,
        limit: 120,
    })

    if (!rate.allowed) {
        return NextResponse.json(
            { error: "Demasiadas solicitudes. Intenta más tarde." },
            {
                status: 429,
                headers:
                    rate.retryAfterMs !== null
                        ? { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) }
                        : undefined,
            }
        )
    }

    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const debateId = searchParams.get("debateId")
    const team = searchParams.get("team")
    const cursor = searchParams.get("cursor")

    if (!debateId || !isChatTeam(team)) {
        return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    const userId = session.user.id

    const isAdmin = session.user.role === "ADMIN"
    if (!isAdmin) {
        const reg = await db.query.debateRegistration.findFirst({
            where: and(
                eq(debateRegistration.userId, userId),
                eq(debateRegistration.debateId, debateId)
            ),
            columns: { team: true },
        })
        if (!reg || reg.team !== team) {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
        }
    }

    const conditions = [
        eq(chatMessage.debateId, debateId),
        eq(chatMessage.team, team),
        eq(chatMessage.deleted, false),
    ]
    if (cursor) {
        const d = new Date(cursor)
        if (Number.isNaN(d.getTime())) {
            return NextResponse.json({ error: "cursor inválido" }, { status: 400 })
        }
        conditions.push(lt(chatMessage.createdAt, d))
    }

    const messages = await db.query.chatMessage.findMany({
        where: and(...conditions),
        orderBy: [desc(chatMessage.createdAt)],
        limit: PAGE_SIZE,
        with: {
            user: { columns: { id: true, name: true, image: true } },
        },
    })

    const older = messages[messages.length - 1]
    const nextCursor = messages.length === PAGE_SIZE ? older?.createdAt.toISOString() : null

    return NextResponse.json({ messages: messages.reverse(), nextCursor })
}
