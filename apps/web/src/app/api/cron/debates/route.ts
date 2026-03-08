import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { runDebateScheduleTransition } from "@/lib/debates"

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
