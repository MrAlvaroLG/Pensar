import { auth } from "@/lib/auth"
import { getUserRegistrationForHighlightedDebate } from "@/lib/debates"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        return NextResponse.json({ registration: null })
    }

    const registration = await getUserRegistrationForHighlightedDebate(session.user.id)

    return NextResponse.json({ registration })
}
