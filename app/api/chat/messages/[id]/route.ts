import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { chatMessage } from "@/lib/db/schema"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { id } = await params
    const message = await db.query.chatMessage.findFirst({
        where: eq(chatMessage.id, id),
        columns: { userId: true, deleted: true },
    })

    if (!message) {
        return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 })
    }

    if (message.deleted) {
        return NextResponse.json({ ok: true })
    }

    if (message.userId !== session.user.id) {
        return NextResponse.json(
            { error: "Solo puedes eliminar tus propios mensajes" },
            { status: 403 }
        )
    }

    await db
        .update(chatMessage)
        .set({ deleted: true, deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(chatMessage.id, id))

    return NextResponse.json({ ok: true })
}
