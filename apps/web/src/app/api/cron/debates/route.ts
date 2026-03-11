import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { runDebateScheduleTransition } from "@/lib/debates"
import prisma from "@pensar/db"
import { deleteChatFolder } from "@/lib/supabase-storage"

export const runtime = "nodejs"

function isAuthorized(request: Request) {
    const secret = process.env.CRON_SECRET

    if (!secret) {
        return false
    }

    const authHeader = request.headers.get("authorization")
    const tokenFromAuth = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length).trim()
        : null
    const tokenFromHeader = request.headers.get("x-cron-secret")

    return tokenFromAuth === secret || tokenFromHeader === secret
}

async function handleCron(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await runDebateScheduleTransition()

    // Clean up chat data for debates that just finished
    if (result.finishedCount > 0) {
        const finishedDebates = await prisma.debate.findMany({
            where: { status: "FINISHED" },
            select: { id: true },
            orderBy: { endAt: "desc" },
            take: result.finishedCount,
        })

        await Promise.allSettled(
            finishedDebates.map(async (debate) => {
                // Hard delete chat messages and bans (reports cascade via FK)
                await prisma.chatMessage.deleteMany({ where: { debateId: debate.id } })
                await prisma.chatBan.deleteMany({ where: { debateId: debate.id } })
                // Remove files from Supabase Storage
                await deleteChatFolder(debate.id)
            })
        )
    }

    revalidatePath("/debates")

    return NextResponse.json({
        ok: true,
        result,
    })
}

export async function GET(request: Request) {
    return handleCron(request)
}

export async function POST(request: Request) {
    return handleCron(request)
}
