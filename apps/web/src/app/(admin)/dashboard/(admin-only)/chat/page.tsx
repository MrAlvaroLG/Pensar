import { redirect } from "next/navigation"
import prisma from "@pensar/db"
import { ensureAdminSession } from "@/lib/admin-auth"
import { DashboardCard } from "@/components/admin/dashboard-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FileText, Music, Image as ImageIcon } from "lucide-react"

async function getHighlightedDebate() {
    return prisma.debate.findFirst({
        where: { status: { in: ["LIVE", "SCHEDULED"] } },
        orderBy: { startAt: "asc" },
        select: { id: true, title: true, question: true },
    })
}

function formatTime(date: Date) {
    return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

function FileIcon({ type }: { type: string | null }) {
    if (type === "IMAGE") return <ImageIcon className="size-4 shrink-0 text-muted-foreground" />
    if (type === "AUDIO") return <Music className="size-4 shrink-0 text-muted-foreground" />
    return <FileText className="size-4 shrink-0 text-muted-foreground" />
}

function MessageItem({
    msg,
}: {
    msg: {
        id: string
        content: string
        fileUrl: string | null
        fileType: string | null
        fileName: string | null
        createdAt: Date
        user: { name: string; image: string | null }
    }
}) {
    return (
        <div className="flex gap-2 border-b border-border/50 py-2 last:border-0">
            <Avatar className="mt-0.5 size-7 shrink-0">
                <AvatarImage src={msg.user.image ?? undefined} />
                <AvatarFallback className="text-xs">
                    {msg.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{msg.user.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                        {formatTime(msg.createdAt)}
                    </span>
                </div>
                {msg.fileUrl && (
                    <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-500 underline underline-offset-2"
                    >
                        <FileIcon type={msg.fileType} />
                        <span className="truncate max-w-[200px]">
                            {msg.fileName ?? "archivo"}
                        </span>
                    </a>
                )}
                {msg.content && (
                    <p className="break-words text-sm text-foreground">{msg.content}</p>
                )}
            </div>
        </div>
    )
}

export default async function AdminChatPage() {
    await ensureAdminSession().catch(() => redirect("/login"))

    const debate = await getHighlightedDebate()

    if (!debate) {
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">Chat — Mensajes</h1>
                <p className="text-sm text-muted-foreground">
                    No hay debate activo o programado actualmente.
                </p>
            </div>
        )
    }

    const [redMessages, blueMessages] = await Promise.all([
        prisma.chatMessage.findMany({
            where: { debateId: debate.id, team: "red", deleted: false },
            orderBy: { createdAt: "asc" },
            take: 100,
            include: { user: { select: { name: true, image: true } } },
        }),
        prisma.chatMessage.findMany({
            where: { debateId: debate.id, team: "blue", deleted: false },
            orderBy: { createdAt: "asc" },
            take: 100,
            include: { user: { select: { name: true, image: true } } },
        }),
    ])

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Chat — Mensajes</h1>
                    <p className="text-sm text-muted-foreground">{debate.question}</p>
                </div>
                <Badge variant="outline" className="shrink-0">
                    {debate.title}
                </Badge>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Red team */}
                <DashboardCard>
                    <div className="mb-3 flex items-center gap-2">
                        <h2 className="font-semibold text-red-500">Equipo Rojo</h2>
                        <span className="text-xs text-muted-foreground">
                            ({redMessages.length} mensajes)
                        </span>
                    </div>
                    {redMessages.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Sin mensajes
                        </p>
                    ) : (
                        <div className="max-h-[70vh] overflow-y-auto">
                            {redMessages.map((m) => (
                                <MessageItem key={m.id} msg={m} />
                            ))}
                        </div>
                    )}
                </DashboardCard>

                {/* Blue team */}
                <DashboardCard>
                    <div className="mb-3 flex items-center gap-2">
                        <h2 className="font-semibold text-blue-500">Equipo Azul</h2>
                        <span className="text-xs text-muted-foreground">
                            ({blueMessages.length} mensajes)
                        </span>
                    </div>
                    {blueMessages.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Sin mensajes
                        </p>
                    ) : (
                        <div className="max-h-[70vh] overflow-y-auto">
                            {blueMessages.map((m) => (
                                <MessageItem key={m.id} msg={m} />
                            ))}
                        </div>
                    )}
                </DashboardCard>
            </div>
        </div>
    )
}
