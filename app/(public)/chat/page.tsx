import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, desc, eq } from "drizzle-orm"

import { auth } from "@/lib/auth"
import { ChatClient } from "./chat-client"
import { getHighlightedDebate } from "@/lib/debates"
import { db } from "@/lib/db"
import type { ChatTeam } from "@/lib/db/schema"
import { chatMessage, debateRegistration } from "@/lib/db/schema"

async function getInitialMessages(debateId: string, team: ChatTeam) {
    const messages = await db.query.chatMessage.findMany({
        where: and(
            eq(chatMessage.debateId, debateId),
            eq(chatMessage.team, team),
            eq(chatMessage.deleted, false)
        ),
        orderBy: [desc(chatMessage.createdAt)],
        limit: 50,
        with: {
            user: { columns: { id: true, name: true, image: true } },
        },
    })
    return messages.reverse()
}

export default async function ChatPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect("/login")
    }

    const debate = await getHighlightedDebate()

    if (!debate) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">No hay debate activo</p>
                <p className="text-sm text-muted-foreground">
                    El chat estará disponible cuando haya un debate programado o en curso.
                </p>
            </div>
        )
    }

    const registration = await db.query.debateRegistration.findFirst({
        where: and(
            eq(debateRegistration.userId, session.user.id),
            eq(debateRegistration.debateId, debate.id)
        ),
        columns: { team: true },
    })

    const team = registration?.team

    if (!team || (team !== "red" && team !== "blue")) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
                <p className="text-lg font-medium">Sin acceso al chat</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                    El chat es exclusivo para participantes inscritos en equipo{" "}
                    <span className="text-red-500 font-medium">Rojo</span> o{" "}
                    <span className="text-blue-500 font-medium">Azul</span>. Si ya te
                    inscribiste en el equipo público o aún no lo has hecho, no tienes
                    acceso.
                </p>
            </div>
        )
    }

    const initialMessages = await getInitialMessages(debate.id, team as ChatTeam)

    return (
        <ChatClient
            key={`${debate.id}:${team}`}
            debate={debate}
            team={team as ChatTeam}
            currentUser={{ id: session.user.id, name: session.user.name, image: session.user.image ?? null }}
            initialMessages={initialMessages.map((m) => ({
                id: m.id,
                content: m.content,
                fileUrl: m.fileUrl,
                fileType: m.fileType,
                fileName: m.fileName,
                createdAt: m.createdAt.toISOString(),
                user: m.user,
            }))}
        />
    )
}
