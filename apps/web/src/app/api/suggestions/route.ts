import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { Prisma } from "@prisma/client"

import prisma from "@pensar/db"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() })

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

    await prisma.$executeRaw(
        Prisma.sql`
            INSERT INTO "user_suggestion" ("id", "userId", "subject", "message", "createdAt", "updatedAt")
            VALUES (${suggestionId}, ${session.user.id}, ${subject.slice(0, 120)}, ${message.slice(0, 1200)}, NOW(), NOW())
        `
    )

    return NextResponse.json({ ok: true }, { status: 201 })
}
