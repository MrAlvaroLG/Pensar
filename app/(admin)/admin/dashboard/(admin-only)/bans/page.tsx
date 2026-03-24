import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, asc, desc, eq, inArray } from "drizzle-orm"

import { ensureAdminSession } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import {
    chatBan,
    chatMessage,
    chatReport,
    debate,
    debateRegistration,
} from "@/lib/db/schema"
import { BansClient } from "./bans-client"

async function getHighlightedDebate() {
    return db.query.debate.findFirst({
        where: inArray(debate.status, ["LIVE", "SCHEDULED"]),
        orderBy: [asc(debate.startAt)],
        columns: { id: true, title: true },
    })
}

export interface RegistrationWithBan {
    registrationId: string
    userId: string
    userName: string
    userEmail: string
    team: string
    ban: {
        id: string
        reason: string | null
        expiresAt: string | null
    } | null
}

export interface ReportRow {
    reportId: string
    reportedBy: string
    reason: string | null
    status: string
    createdAt: string
    message: {
        id: string
        content: string
        authorId: string
        authorName: string
        team: string
    }
}

interface RegistrationQueryRow {
    id: string
    userId: string
    team: string
    user: {
        id: string
        name: string
        email: string
    }
}

interface ActiveBanRow {
    id: string
    userId: string
    reason: string | null
    expiresAt: Date | null
}

interface ReportQueryRow {
    id: string
    reason: string | null
    status: string
    createdAt: Date
    reporter: {
        name: string
    }
    message: {
        id: string
        content: string
        team: string
        user: {
            id: string
            name: string
        }
    }
}

export default async function BansPage() {
    const adminSession = await ensureAdminSession().catch(() => null)
    if (!adminSession) redirect("/login")

    const debateRow = await getHighlightedDebate()

    async function banUserAction(formData: FormData) {
        "use server"
        await ensureAdminSession()

        const userId = String(formData.get("userId") ?? "").trim()
        const debateId = String(formData.get("debateId") ?? "").trim()
        const reason = String(formData.get("reason") ?? "").trim() || null
        const durationHours = Number(formData.get("durationHours") ?? "0")
        const adminId = (await ensureAdminSession()).user.id

        if (!userId || !debateId) return

        const expiresAt =
            durationHours > 0
                ? new Date(Date.now() + durationHours * 60 * 60 * 1000)
                : null

        await db
            .insert(chatBan)
            .values({
                id: crypto.randomUUID(),
                userId,
                debateId,
                bannedBy: adminId,
                reason,
                expiresAt,
                createdAt: new Date(),
            })
            .onConflictDoUpdate({
                target: [chatBan.userId, chatBan.debateId],
                set: {
                    bannedBy: adminId,
                    reason,
                    expiresAt,
                },
            })

        revalidatePath("/admin/dashboard/bans")
    }

    async function unbanUserAction(formData: FormData) {
        "use server"
        await ensureAdminSession()

        const userId = String(formData.get("userId") ?? "").trim()
        const debateId = String(formData.get("debateId") ?? "").trim()

        if (!userId || !debateId) return

        await db
            .delete(chatBan)
            .where(and(eq(chatBan.userId, userId), eq(chatBan.debateId, debateId)))

        revalidatePath("/admin/dashboard/bans")
    }

    async function handleReportAction(formData: FormData) {
        "use server"
        const admin = await ensureAdminSession()

        const reportId = String(formData.get("reportId") ?? "").trim()
        const action = String(formData.get("action") ?? "").trim() as "banAuthor" | "dismiss"
        const debateId = String(formData.get("debateId") ?? "").trim()
        const messageId = String(formData.get("messageId") ?? "").trim()
        const authorId = String(formData.get("authorId") ?? "").trim()
        const durationHours = Number(formData.get("durationHours") ?? "0")
        const reason = String(formData.get("reason") ?? "").trim() || null

        if (!reportId) return

        if (action === "banAuthor" && authorId && debateId) {
            const expiresAt =
                durationHours > 0
                    ? new Date(Date.now() + durationHours * 60 * 60 * 1000)
                    : null
            await db
                .insert(chatBan)
                .values({
                    id: crypto.randomUUID(),
                    userId: authorId,
                    debateId,
                    bannedBy: admin.user.id,
                    reason,
                    expiresAt,
                    createdAt: new Date(),
                })
                .onConflictDoUpdate({
                    target: [chatBan.userId, chatBan.debateId],
                    set: {
                        bannedBy: admin.user.id,
                        reason,
                        expiresAt,
                    },
                })
            await db
                .update(chatMessage)
                .set({ deleted: true, deletedAt: new Date(), updatedAt: new Date() })
                .where(eq(chatMessage.id, messageId))
        }

        await db
            .update(chatReport)
            .set({ status: action === "dismiss" ? "DISMISSED" : "REVIEWED" })
            .where(eq(chatReport.id, reportId))

        revalidatePath("/admin/dashboard/bans")
    }

    if (!debateRow) {
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">Baneos y Reportes</h1>
                <p className="text-sm text-muted-foreground">
                    No hay debate activo o programado actualmente.
                </p>
            </div>
        )
    }

    const debate = debateRow

    const [registrations, activeBans, reports]: [
        RegistrationQueryRow[],
        ActiveBanRow[],
        ReportQueryRow[]
    ] = await Promise.all([
        db.query.debateRegistration.findMany({
            where: and(
                eq(debateRegistration.debateId, debate.id),
                inArray(debateRegistration.team, ["red", "blue"])
            ),
            orderBy: [asc(debateRegistration.createdAt)],
            with: {
                user: { columns: { id: true, name: true, email: true } },
            },
        }),
        db.query.chatBan.findMany({
            where: eq(chatBan.debateId, debate.id),
        }),
        db.query.chatReport.findMany({
            where: eq(chatReport.status, "PENDING"),
            orderBy: [desc(chatReport.createdAt)],
            limit: 100,
            with: {
                message: {
                    with: {
                        user: { columns: { id: true, name: true } },
                    },
                },
                reporter: { columns: { name: true } },
            },
        }),
    ])

    const banMap = new Map(activeBans.map((b: ActiveBanRow) => [b.userId, b]))

    const rows: RegistrationWithBan[] = registrations.map((r: RegistrationQueryRow) => {
        const ban = banMap.get(r.userId)
        return {
            registrationId: r.id,
            userId: r.userId,
            userName: r.user.name,
            userEmail: r.user.email,
            team: r.team,
            ban: ban
                ? {
                      id: ban.id,
                      reason: ban.reason,
                      expiresAt: ban.expiresAt?.toISOString() ?? null,
                  }
                : null,
        }
    })

    const reportRows: ReportRow[] = reports.map((r: ReportQueryRow) => ({
        reportId: r.id,
        reportedBy: r.reporter.name,
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        message: {
            id: r.message.id,
            content: r.message.content,
            authorId: r.message.user.id,
            authorName: r.message.user.name,
            team: r.message.team,
        },
    }))

    return (
        <BansClient
            debateId={debate.id}
            debateTitle={debate.title}
            rows={rows}
            reports={reportRows}
            banUserAction={banUserAction}
            unbanUserAction={unbanUserAction}
            handleReportAction={handleReportAction}
        />
    )
}
