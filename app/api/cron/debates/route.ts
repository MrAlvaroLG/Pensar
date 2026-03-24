import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { runDebateScheduleTransition } from "@/lib/debates"
import { db } from "@/lib/db"
import { chatBan, chatMessage, debate } from "@/lib/db/schema"
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
        const finishedDebates = await db.query.debate.findMany({
            where: eq(debate.status, "FINISHED"),
            columns: { id: true },
            orderBy: [desc(debate.endAt)],
            limit: result.finishedCount,
        })

        await Promise.allSettled(
            finishedDebates.map(async (row) => {
                await db.delete(chatMessage).where(eq(chatMessage.debateId, row.id))
                await db.delete(chatBan).where(eq(chatBan.debateId, row.id))
                await deleteChatFolder(row.id)
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
