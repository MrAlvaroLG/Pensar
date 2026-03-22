import { notFound } from "next/navigation"
import { getFinishedDebateById } from "@/lib/debates"
import type { PublicSummaryBlock } from "@/lib/debates"
import { ResumenClient } from "./resumen-client"

export default async function ResumenPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const debate = await getFinishedDebateById(id)

    if (!debate) {
        notFound()
    }

    const blocks: PublicSummaryBlock[] = debate.summaryBlocks.map((b) => ({
        id: b.id,
        team: b.team,
        content: b.content,
    }))

    return (
        <ResumenClient
            debateTitle={debate.title}
            debateSubtitle={debate.subtitle}
            blocks={blocks}
        />
    )
}
