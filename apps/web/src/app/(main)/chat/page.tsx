import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@pensar/db"
import { ChatClient } from "./chat-client"
import type { ChatTeam } from "@prisma/client"

async function getHighlightedDebate() {
    return prisma.debate.findFirst({
        where: { status: { in: ["LIVE", "SCHEDULED"] } },
        orderBy: { startAt: "asc" },
        select: { id: true, title: true, question: true },
    })
}

async function getInitialMessages(debateId: string, team: ChatTeam) {
    const messages = await prisma.chatMessage.findMany({
        where: { debateId, team, deleted: false },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
            user: { select: { id: true, name: true, image: true } },
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

    const registration = await prisma.debateRegistration.findUnique({
        where: {
            userId_debateId: {
                userId: session.user.id,
                debateId: debate.id,
            },
        },
        select: { team: true },
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
