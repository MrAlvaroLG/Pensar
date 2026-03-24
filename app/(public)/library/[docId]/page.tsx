import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { PdfViewer } from "@/components/docs/pdf-viewer-client"
import { db } from "@/lib/db"
import { libraryDocument } from "@/lib/db/schema"
import { getPublicUrl } from "@/lib/supabase-storage"

interface DocPageProps {
    params: Promise<{ docId: string }>
}

export default async function DocPage({ params }: DocPageProps) {
    const { docId } = await params

    const doc = await db.query.libraryDocument.findFirst({
        where: eq(libraryDocument.id, docId),
    })

    if (!doc) {
        notFound()
    }

    const pdfUrl = getPublicUrl(doc.storagePath)

    return (
        <PdfViewer
            url={pdfUrl}
            title={doc.title}
            description={doc.description}
        />
    )
}
