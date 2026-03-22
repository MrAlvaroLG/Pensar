import { getPublicDebatesData, getUserRegistrationForHighlightedDebate } from "@/lib/debates"
import { DebatesPageClient } from "./debates-page-client"
import { auth } from "@/lib/auth"
import type { ViewerTeam } from "@/lib/debate-domain"
import { headers } from "next/headers"

export default async function DebatesPage() {
    const { highlightedDebate, pastDebates } = await getPublicDebatesData()
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const registration = session?.user?.id
        ? await getUserRegistrationForHighlightedDebate(session.user.id)
        : null

    const viewerTeam: ViewerTeam = registration?.team ?? "none"

    return (
        <DebatesPageClient
            highlightedDebate={highlightedDebate}
            pastDebates={pastDebates}
            viewerTeam={viewerTeam}
            isLoggedIn={Boolean(session?.user)}
        />
    )
}