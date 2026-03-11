import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@pensar/db"

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const messageId = String(body.messageId ?? "").trim()
    const reason = String(body.reason ?? "").trim().slice(0, 500) || null

    if (!messageId) {
        return NextResponse.json({ error: "messageId es requerido" }, { status: 400 })
    }

    const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        select: { id: true, deleted: true },
    })

    if (!message || message.deleted) {
        return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    // Prevent duplicate reports from same user
    const existing = await prisma.chatReport.findFirst({
        where: { messageId, reportedBy: session.user.id },
        select: { id: true },
    })
    if (existing) {
        return NextResponse.json({ ok: true, duplicate: true })
    }

    await prisma.chatReport.create({
        data: {
            messageId,
            reportedBy: session.user.id,
            reason,
            status: "PENDING",
        },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}
