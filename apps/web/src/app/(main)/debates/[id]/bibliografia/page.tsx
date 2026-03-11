import { notFound } from "next/navigation"
import { getFinishedDebateById } from "@/lib/debates"
import type { PublicBibliographyLink, PublicBibliographyDoc } from "@/lib/debates"
import { getDebateDocPublicUrl } from "@/lib/supabase-storage"
import { BibliografiaClient } from "./bibliografia-client"

export default async function BibliografiaPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const debate = await getFinishedDebateById(id)

    if (!debate) {
        notFound()
    }

    const links: PublicBibliographyLink[] = debate.bibliography.map((b) => ({
        id: b.id,
        label: b.label,
        url: b.url,
    }))

    const docs: PublicBibliographyDoc[] = debate.bibliographyDocs.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        url: getDebateDocPublicUrl(d.storagePath),
    }))

    return (
        <BibliografiaClient
            debateTitle={debate.title}
            debateSubtitle={debate.subtitle}
            links={links}
            docs={docs}
        />
    )
}
