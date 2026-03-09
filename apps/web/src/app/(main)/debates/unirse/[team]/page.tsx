import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { isDebateTeamRouteParam, ROUTE_TO_TEAM, type ViewerTeam } from "@/lib/debate-domain"
import { headers } from "next/headers"
import { getPublicDebatesData, getUserRegistrationForHighlightedDebate } from "@/lib/debates"
import { TeamJoinClient } from "./team-join-client"

export default async function TeamJoinPage({
    params,
}: {
    params: Promise<{ team: string }>
}) {
    const { team: routeTeam } = await params

    if (!isDebateTeamRouteParam(routeTeam)) {
        notFound()
    }

    const selectedTeam = ROUTE_TO_TEAM[routeTeam]

    const [session, { highlightedDebate }] = await Promise.all([
        auth.api.getSession({
            headers: await headers(),
        }),
        getPublicDebatesData(),
    ])

    const registration = session?.user?.id
        ? await getUserRegistrationForHighlightedDebate(session.user.id)
        : null

    const viewerTeam: ViewerTeam = registration?.team ?? "none"

    return (
        <TeamJoinClient
            selectedTeam={selectedTeam}
            viewerTeam={viewerTeam}
            isLoggedIn={Boolean(session?.user)}
            highlightedDebate={highlightedDebate}
        />
    )
}
