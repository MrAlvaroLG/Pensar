import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { userSuggestion } from "@/lib/db/schema"
import { checkRateLimit, getClientIp } from "@/lib/utils/rate-limit"

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })

    const ip = getClientIp(request)
    const userId = session?.user?.id ?? "anon"
    const rate = checkRateLimit({
        key: `suggestions:${userId}:${ip}`,
        windowMs: 60 * 60 * 1000,
        limit: 5,
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
    const subject = String(body.subject ?? "").trim()
    const message = String(body.message ?? "").trim()

    if (subject.length < 4) {
        return NextResponse.json(
            { error: "El asunto debe tener al menos 4 caracteres" },
            { status: 400 }
        )
    }

    if (message.length < 10) {
        return NextResponse.json(
            { error: "El mensaje debe tener al menos 10 caracteres" },
            { status: 400 }
        )
    }

    const suggestionId = crypto.randomUUID()
    const now = new Date()

    await db.insert(userSuggestion).values({
        id: suggestionId,
        userId: session.user.id,
        subject: subject.slice(0, 120),
        message: message.slice(0, 1200),
        createdAt: now,
        updatedAt: now,
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}
