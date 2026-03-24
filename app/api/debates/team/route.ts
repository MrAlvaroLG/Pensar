import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { isDebateTeam } from "@/lib/debate-domain"
import { getHighlightedDebate } from "@/lib/debates"
import { db } from "@/lib/db"
import { debateRegistration } from "@/lib/db/schema"

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const team = body?.team

    if (!isDebateTeam(team)) {
        return NextResponse.json(
            { error: "Equipo inválido. Usa red, blue o public." },
            { status: 400 },
        )
    }

    const highlightedDebate = await getHighlightedDebate()

    if (!highlightedDebate) {
        return NextResponse.json(
            { error: "No hay un debate activo o programado para inscribirse." },
            { status: 409 },
        )
    }

    const existingRegistration = await db.query.debateRegistration.findFirst({
        where: and(
            eq(debateRegistration.userId, session.user.id),
            eq(debateRegistration.debateId, highlightedDebate.id)
        ),
    })

    if (existingRegistration) {
        return NextResponse.json(
            {
                error: "Ya estás inscrito en este debate. La selección de equipo es irreversible.",
                currentTeam: existingRegistration.team,
                status: existingRegistration.status,
            },
            { status: 409 },
        )
    }

    const now = new Date()
    const [registration] = await db
        .insert(debateRegistration)
        .values({
            id: crypto.randomUUID(),
            userId: session.user.id,
            debateId: highlightedDebate.id,
            team,
            createdAt: now,
            updatedAt: now,
        })
        .returning()

    return NextResponse.json({
        success: true,
        team,
        status: registration!.status,
        debateId: highlightedDebate.id,
    })
}
