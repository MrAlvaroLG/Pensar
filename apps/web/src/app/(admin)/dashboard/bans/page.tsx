import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import prisma from "@pensar/db"
import { ensureAdminSession } from "@/lib/admin-auth"
import { BansClient } from "./bans-client"

async function getHighlightedDebate() {
    return prisma.debate.findFirst({
        where: { status: { in: ["LIVE", "SCHEDULED"] } },
        orderBy: { startAt: "asc" },
        select: { id: true, title: true },
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

export default async function BansPage() {
    const adminSession = await ensureAdminSession().catch(() => null)
    if (!adminSession) redirect("/login")

    const debate = await getHighlightedDebate()

    // ── Server Actions ──────────────────────────────────────────────────────────

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

        await prisma.chatBan.upsert({
            where: { userId_debateId: { userId, debateId } },
            create: { userId, debateId, bannedBy: adminId, reason, expiresAt },
            update: { bannedBy: adminId, reason, expiresAt },
        })

        revalidatePath("/dashboard/bans")
    }

    async function unbanUserAction(formData: FormData) {
        "use server"
        await ensureAdminSession()

        const userId = String(formData.get("userId") ?? "").trim()
        const debateId = String(formData.get("debateId") ?? "").trim()

        if (!userId || !debateId) return

        await prisma.chatBan.deleteMany({
            where: { userId, debateId },
        })

        revalidatePath("/dashboard/bans")
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
            await prisma.chatBan.upsert({
                where: { userId_debateId: { userId: authorId, debateId } },
                create: {
                    userId: authorId,
                    debateId,
                    bannedBy: admin.user.id,
                    reason,
                    expiresAt,
                },
                update: {
                    bannedBy: admin.user.id,
                    reason,
                    expiresAt,
                },
            })
            // Soft-delete the reported message
            await prisma.chatMessage.update({
                where: { id: messageId },
                data: { deleted: true, deletedAt: new Date() },
            })
        }

        await prisma.chatReport.update({
            where: { id: reportId },
            data: { status: action === "dismiss" ? "DISMISSED" : "REVIEWED" },
        })

        revalidatePath("/dashboard/bans")
    }

    // ── Data ───────────────────────────────────────────────────────────────────

    if (!debate) {
        return (
            <div className="space-y-4">
                <h1 className="text-xl font-semibold">Baneos y Reportes</h1>
                <p className="text-sm text-muted-foreground">
                    No hay debate activo o programado actualmente.
                </p>
            </div>
        )
    }

    const [registrations, activeBans, reports] = await Promise.all([
        prisma.debateRegistration.findMany({
            where: {
                debateId: debate.id,
                team: { in: ["red", "blue"] },
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.chatBan.findMany({
            where: { debateId: debate.id },
        }),
        prisma.chatReport.findMany({
            where: { status: "PENDING" },
            orderBy: { createdAt: "desc" },
            take: 100,
            include: {
                message: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                reporter: { select: { name: true } },
            },
        }),
    ])

    const banMap = new Map(activeBans.map((b) => [b.userId, b]))

    const rows: RegistrationWithBan[] = registrations.map((r) => {
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

    const reportRows: ReportRow[] = reports.map((r) => ({
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
