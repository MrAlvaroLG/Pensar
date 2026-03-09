import prisma, { DebateStatus } from "@pensar/db"
import { unstable_noStore as noStore } from "next/cache"
import { isDebateTeam, type DebateRegistrationStatus, type DebateTeam } from "@/lib/debate-domain"

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

export interface ViewerDebateRegistration {
    debateId: string
    debateTitle: string
    team: DebateTeam
    status: DebateRegistrationStatus
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
})

async function getHighlightedDebateRecord() {
    const [liveDebate, scheduledDebate] = await Promise.all([
        prisma.debate.findFirst({
            where: {
                status: "LIVE",
            },
            orderBy: {
                startAt: "asc",
            },
        }),
        prisma.debate.findFirst({
            where: {
                status: "SCHEDULED",
            },
            orderBy: {
                startAt: "asc",
            },
        }),
    ])

    return liveDebate ?? scheduledDebate
}

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

    await syncDebateScheduleIfNeeded()

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

export async function syncDebateScheduleIfNeeded(now = new Date()) {
    const pendingTransition = await prisma.debate.findFirst({
        where: {
            OR: [
                {
                    status: {
                        in: ["LIVE", "SCHEDULED"],
                    },
                    endAt: {
                        lte: now,
                    },
                },
                {
                    status: "SCHEDULED",
                    startAt: {
                        lte: now,
                    },
                    endAt: {
                        gt: now,
                    },
                },
            ],
        },
        select: {
            id: true,
        },
    })

    if (!pendingTransition) {
        return {
            now: now.toISOString(),
            finishedCount: 0,
            promotedId: null,
            skipped: true,
        }
    }

    const result = await runDebateScheduleTransition(now)

    return {
        ...result,
        skipped: false,
    }
}

export async function getPublicDebatesData() {
    noStore()

    await syncDebateScheduleIfNeeded()

    const [highlightedDebate, pastDebates] = await Promise.all([
        getHighlightedDebateRecord(),
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

export async function getHighlightedDebate() {
    noStore()

    await syncDebateScheduleIfNeeded()

    return getHighlightedDebateRecord()
}

export async function getUserRegistrationForHighlightedDebate(userId: string): Promise<ViewerDebateRegistration | null> {
    const highlightedDebate = await getHighlightedDebate()

    if (!highlightedDebate) {
        return null
    }

    const registration = await prisma.debateRegistration.findUnique({
        where: {
            userId_debateId: {
                userId,
                debateId: highlightedDebate.id,
            },
        },
    })

    if (!registration) {
        return null
    }

    if (!isDebateTeam(registration.team)) {
        return null
    }

    return {
        debateId: highlightedDebate.id,
        debateTitle: highlightedDebate.subtitle,
        team: registration.team,
        status: registration.status,
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
