import { getPublicDebatesData } from "@/lib/debates"
import { DebatesPageClient } from "./debates-page-client"

export default async function DebatesPage() {
    const { highlightedDebate, pastDebates } = await getPublicDebatesData()

    return (
        <DebatesPageClient
            highlightedDebate={highlightedDebate}
            pastDebates={pastDebates}
        />
    )
}