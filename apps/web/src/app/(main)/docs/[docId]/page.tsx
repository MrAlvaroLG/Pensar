import { notFound } from "next/navigation"
import prisma from "@pensar/db"
import { getPublicUrl } from "@/lib/supabase-storage"
import { PdfViewer } from "@/components/docs/pdf-viewer"

interface DocPageProps {
    params: Promise<{ docId: string }>
}

export default async function DocPage({ params }: DocPageProps) {
    const { docId } = await params

    const doc = await prisma.libraryDocument.findUnique({
        where: { id: docId },
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
