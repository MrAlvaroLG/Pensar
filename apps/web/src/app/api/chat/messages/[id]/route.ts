import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@pensar/db"

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { id } = await params
    const message = await prisma.chatMessage.findUnique({
        where: { id },
        select: { userId: true, deleted: true },
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

    await prisma.chatMessage.update({
        where: { id },
        data: { deleted: true, deletedAt: new Date() },
    })

    return NextResponse.json({ ok: true })
}
