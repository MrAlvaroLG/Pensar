import { and, asc, desc, eq, gt, inArray, lte, or } from "drizzle-orm"

import { db } from "@/lib/db"
import type { DebateStatus } from "@/lib/db/schema"
import {
    debate,
    debateBibliography,
    debateBibliographyDoc,
    debateRegistration,
    debateSummaryBlock,
} from "@/lib/db/schema"
import { isDebateTeam, type DebateRegistrationStatus, type DebateTeam, type SummaryBlockTeam } from "@/lib/debate-domain"
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
    subtitle: string
    question: string
    quote: string
    dateLabel: string
}

export interface PublicSummaryBlock {
    id: string
    team: SummaryBlockTeam
    content: string
}

export interface PublicBibliographyLink {
    id: string
    label: string
    url: string
}

export interface PublicBibliographyDoc {
    id: string
    title: string
    description: string | null
    url: string
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
        db.query.debate.findFirst({
            where: eq(debate.status, "LIVE"),
            orderBy: [asc(debate.startAt)],
        }),
        db.query.debate.findFirst({
            where: eq(debate.status, "SCHEDULED"),
            orderBy: [asc(debate.startAt)],
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

    return db.query.debate.findMany({
        where: inArray(debate.status, ["LIVE", "SCHEDULED"]),
        orderBy: [asc(debate.startAt)],
        with: {
            bibliography: {
                orderBy: [asc(debateBibliography.createdAt)],
            },
        },
    })
}

export async function syncDebateScheduleIfNeeded(now = new Date()) {
    const pendingTransition = await db.query.debate.findFirst({
        where: or(
            and(
                inArray(debate.status, ["LIVE", "SCHEDULED"]),
                lte(debate.endAt, now)
            ),
            and(
                eq(debate.status, "SCHEDULED"),
                lte(debate.startAt, now),
                gt(debate.endAt, now)
            )
        ),
        columns: {
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
        db.query.debate.findMany({
            where: eq(debate.status, "FINISHED"),
            orderBy: [desc(debate.endAt)],
            limit: 6,
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
        pastDebates: pastDebates.map((row) => ({
            id: row.id,
            title: row.title,
            subtitle: row.subtitle,
            question: row.question,
            quote: row.thesis,
            dateLabel: DATE_FORMATTER.format(row.endAt),
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

    const registration = await db.query.debateRegistration.findFirst({
        where: and(
            eq(debateRegistration.userId, userId),
            eq(debateRegistration.debateId, highlightedDebate.id)
        ),
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
    return db.transaction(async (tx) => {
        const finishedRows = await tx
            .update(debate)
            .set({ status: "FINISHED", updatedAt: new Date() })
            .where(
                and(
                    inArray(debate.status, ["LIVE", "SCHEDULED"]),
                    lte(debate.endAt, now)
                )
            )
            .returning({ id: debate.id })

        await tx
            .update(debate)
            .set({ status: "SCHEDULED", updatedAt: new Date() })
            .where(eq(debate.status, "LIVE"))

        const toPromote = await tx.query.debate.findFirst({
            where: and(
                eq(debate.status, "SCHEDULED"),
                lte(debate.startAt, now),
                gt(debate.endAt, now)
            ),
            orderBy: [asc(debate.startAt)],
        })

        let promotedId: string | null = null

        if (toPromote) {
            await tx
                .update(debate)
                .set({ status: "LIVE", updatedAt: new Date() })
                .where(eq(debate.id, toPromote.id))
            promotedId = toPromote.id
        }

        return {
            now: now.toISOString(),
            finishedCount: finishedRows.length,
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

export async function getFinishedDebates() {
    noStore()

    const rows = await db.query.debate.findMany({
        where: eq(debate.status, "FINISHED"),
        orderBy: [desc(debate.endAt)],
        with: {
            summaryBlocks: { columns: { id: true } },
            bibliographyDocs: { columns: { id: true } },
            bibliography: { columns: { id: true } },
        },
    })

    return rows.map((row) => ({
        ...row,
        _count: {
            summaryBlocks: row.summaryBlocks.length,
            bibliographyDocs: row.bibliographyDocs.length,
            bibliography: row.bibliography.length,
        },
    }))
}

export async function getFinishedDebateById(id: string) {
    noStore()

    return db.query.debate.findFirst({
        where: and(eq(debate.id, id), eq(debate.status, "FINISHED")),
        with: {
            summaryBlocks: {
                orderBy: [asc(debateSummaryBlock.order)],
            },
            bibliography: {
                orderBy: [asc(debateBibliography.createdAt)],
            },
            bibliographyDocs: {
                orderBy: [asc(debateBibliographyDoc.createdAt)],
            },
        },
    })
}

export async function getAllPastDebatesForArchive() {
    noStore()

    await syncDebateScheduleIfNeeded()

    const debates = await db.query.debate.findMany({
        where: eq(debate.status, "FINISHED"),
        orderBy: [desc(debate.endAt)],
    })

    return debates.map((row) => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle,
        question: row.question,
        quote: row.thesis,
        dateLabel: DATE_FORMATTER.format(row.endAt),
    } satisfies PublicPastDebate))
}
