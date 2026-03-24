import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { debateRegistration, chatMessage, chatReport } from "@/lib/db/schema"
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit"

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })

    const ip = getClientIp(request)
    const userId = session?.user?.id ?? "anon"
    const rate = checkRateLimit({
        key: `chat_reports:${userId}:${ip}`,
        windowMs: 10 * 60 * 1000,
        limit: 10,
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

    const body = await request.json().catch(() => ({}))
    const messageId = String(body.messageId ?? "").trim()
    const reason = String(body.reason ?? "").trim().slice(0, 500) || null

    if (!messageId) {
        return NextResponse.json({ error: "messageId es requerido" }, { status: 400 })
    }

    const message = await db.query.chatMessage.findFirst({
        where: eq(chatMessage.id, messageId),
        columns: { id: true, debateId: true, team: true, deleted: true },
    })

    if (!message || message.deleted) {
        return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    // AuthZ: solo se permite reportar mensajes del debate en el que el usuario está inscrito.
    // Además, acotamos por el mismo `team` para evitar abuso cruzado.
    const registration = await db.query.debateRegistration.findFirst({
        where: and(
            eq(debateRegistration.userId, session.user.id),
            eq(debateRegistration.debateId, message.debateId),
            eq(debateRegistration.team, message.team),
        ),
        columns: { id: true },
    })

    if (!registration) {
        return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    const existing = await db.query.chatReport.findFirst({
        where: and(
            eq(chatReport.messageId, messageId),
            eq(chatReport.reportedBy, session.user.id)
        ),
        columns: { id: true },
    })
    if (existing) {
        return NextResponse.json({ ok: true, duplicate: true })
    }

    const now = new Date()
    await db.insert(chatReport).values({
        id: crypto.randomUUID(),
        messageId,
        reportedBy: session.user.id,
        reason,
        status: "PENDING",
        createdAt: now,
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}
