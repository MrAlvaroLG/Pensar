import prisma, { DebateStatus } from "@pensar/db"
import { unstable_noStore as noStore } from "next/cache"

export interface PublicDebate {
    id: string
    title: string
    subtitle: string
    question: string
    thesis: string
    dateLabel: string
}

export interface PublicPastDebate {
    id: string
    title: string
    quote: string
    dateLabel: string
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
})

function formatDebateRange(startAt: Date, endAt: Date) {
    return `${DATE_FORMATTER.format(startAt)} - ${DATE_FORMATTER.format(endAt)}`
}

export function toDateTimeLocalValue(date: Date) {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const day = `${date.getDate()}`.padStart(2, "0")
    const hours = `${date.getHours()}`.padStart(2, "0")
    const minutes = `${date.getMinutes()}`.padStart(2, "0")

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export async function getDebateQueue() {
    noStore()

    return prisma.debate.findMany({
        where: {
            status: {
                in: ["LIVE", "SCHEDULED"],
            },
        },
        include: {
            bibliography: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
        orderBy: {
            startAt: "asc",
        },
    })
}

export async function getPublicDebatesData() {
    noStore()

    const [liveDebate, scheduledDebate, pastDebates] = await Promise.all([
        prisma.debate.findFirst({
            where: {
                status: "LIVE",
            },
            include: {
                bibliography: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                startAt: "asc",
            },
        }),
        prisma.debate.findFirst({
            where: {
                status: "SCHEDULED",
            },
            include: {
                bibliography: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
            orderBy: {
                startAt: "asc",
            },
        }),
        prisma.debate.findMany({
            where: {
                status: "FINISHED",
            },
            orderBy: {
                endAt: "desc",
            },
            take: 6,
        }),
    ])

    const highlightedDebate = liveDebate ?? scheduledDebate

    return {
        highlightedDebate: highlightedDebate
            ? {
                id: highlightedDebate.id,
                title: highlightedDebate.title,
                subtitle: highlightedDebate.subtitle,
                question: highlightedDebate.question,
                thesis: highlightedDebate.thesis,
                dateLabel: formatDebateRange(highlightedDebate.startAt, highlightedDebate.endAt),
            }
            : null,
        pastDebates: pastDebates.map((debate) => ({
            id: debate.id,
            title: debate.title,
            quote: debate.thesis,
            dateLabel: DATE_FORMATTER.format(debate.endAt),
        } satisfies PublicPastDebate)),
    }
}

export async function runDebateScheduleTransition(now = new Date()) {
    return prisma.$transaction(async (tx) => {
        const finished = await tx.debate.updateMany({
            where: {
                status: {
                    in: ["LIVE", "SCHEDULED"],
                },
                endAt: {
                    lte: now,
                },
            },
            data: {
                status: "FINISHED",
            },
        })

        await tx.debate.updateMany({
            where: {
                status: "LIVE",
            },
            data: {
                status: "SCHEDULED",
            },
        })

        const toPromote = await tx.debate.findFirst({
            where: {
                status: "SCHEDULED",
                startAt: {
                    lte: now,
                },
                endAt: {
                    gt: now,
                },
            },
            orderBy: {
                startAt: "asc",
            },
        })

        let promotedId: string | null = null

        if (toPromote) {
            await tx.debate.update({
                where: {
                    id: toPromote.id,
                },
                data: {
                    status: "LIVE",
                },
            })
            promotedId = toPromote.id
        }

        return {
            now: now.toISOString(),
            finishedCount: finished.count,
            promotedId,
        }
    })
}

export const DEBATE_STATUS_OPTIONS: Array<{ value: DebateStatus; label: string }> = [
    { value: "DRAFT", label: "Borrador" },
    { value: "SCHEDULED", label: "Programado" },
    { value: "LIVE", label: "En vivo" },
    { value: "FINISHED", label: "Finalizado" },
]
