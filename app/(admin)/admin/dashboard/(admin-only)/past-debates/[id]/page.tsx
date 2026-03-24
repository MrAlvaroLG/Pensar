import { revalidatePath } from "next/cache"
import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { DashboardHeader } from "@/components/admin/dashboard-header"
import { ensureAdminSession } from "@/lib/admin-auth"
import { isSummaryBlockTeam, type SummaryBlockTeam } from "@/lib/debate-domain"
import { getFinishedDebateById } from "@/lib/debates"
import { db } from "@/lib/db"
import {
    debate,
    debateBibliography,
    debateBibliographyDoc,
    debateSummaryBlock,
} from "@/lib/db/schema"
import { deleteDebateDoc, getDebateDocPublicUrl, uploadDebateDoc } from "@/lib/supabase-storage"
import {
    PastDebateEditClient,
    type SummaryBlockData,
    type BibliographyLinkData,
    type BibliographyDocData,
} from "./past-debate-edit-client"

async function saveSummaryBlocksAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const row = await db.query.debate.findFirst({
        where: and(eq(debate.id, debateId), eq(debate.status, "FINISHED")),
        columns: { id: true },
    })
    if (!row) throw new Error("Debate no encontrado")

    const blocksRaw = formData.get("blocks")
    if (typeof blocksRaw !== "string") {
        throw new Error("Datos de bloques invalidos")
    }

    let blocks: Array<{ team: string; content: string }>
    try {
        blocks = JSON.parse(blocksRaw)
    } catch {
        throw new Error("Datos de bloques invalidos")
    }

    if (!Array.isArray(blocks)) {
        throw new Error("Datos de bloques invalidos")
    }

    const validated = blocks.map((block, index) => {
        if (!isSummaryBlockTeam(block.team)) {
            throw new Error(`Equipo invalido en bloque ${index + 1}`)
        }
        if (typeof block.content !== "string" || block.content.trim().length === 0) {
            throw new Error(`Contenido vacio en bloque ${index + 1}`)
        }
        return {
            team: block.team as SummaryBlockTeam,
            content: block.content.trim(),
            order: index,
        }
    })

    const now = new Date()
    await db.transaction(async (tx) => {
        await tx.delete(debateSummaryBlock).where(eq(debateSummaryBlock.debateId, debateId))
        if (validated.length > 0) {
            await tx.insert(debateSummaryBlock).values(
                validated.map((b) => ({
                    id: crypto.randomUUID(),
                    debateId,
                    team: b.team,
                    content: b.content,
                    order: b.order,
                    createdAt: now,
                    updatedAt: now,
                }))
            )
        }
    })

    revalidatePath(`/admin/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/resumen`)
    revalidatePath("/admin/dashboard/past-debates")
    revalidatePath("/debates")
}

async function saveBibliographyLinksAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const row = await db.query.debate.findFirst({
        where: and(eq(debate.id, debateId), eq(debate.status, "FINISHED")),
        columns: { id: true },
    })
    if (!row) throw new Error("Debate no encontrado")

    const linksRaw = formData.get("links")
    if (typeof linksRaw !== "string") {
        throw new Error("Datos de enlaces invalidos")
    }

    let links: Array<{ label: string; url: string }>
    try {
        links = JSON.parse(linksRaw)
    } catch {
        throw new Error("Datos de enlaces invalidos")
    }

    if (!Array.isArray(links)) {
        throw new Error("Datos de enlaces invalidos")
    }

    const validated = links.map((link, index) => {
        if (typeof link.label !== "string" || link.label.trim().length === 0) {
            throw new Error(`Etiqueta vacia en enlace ${index + 1}`)
        }
        if (typeof link.url !== "string" || link.url.trim().length === 0) {
            throw new Error(`URL vacia en enlace ${index + 1}`)
        }
        try {
            new URL(link.url.trim())
        } catch {
            throw new Error(`URL invalida en enlace ${index + 1}`)
        }
        return {
            label: link.label.trim(),
            url: link.url.trim(),
        }
    })

    const now = new Date()
    await db.transaction(async (tx) => {
        await tx.delete(debateBibliography).where(eq(debateBibliography.debateId, debateId))
        if (validated.length > 0) {
            await tx.insert(debateBibliography).values(
                validated.map((l) => ({
                    id: crypto.randomUUID(),
                    debateId,
                    label: l.label,
                    url: l.url,
                    createdAt: now,
                }))
            )
        }
    })

    revalidatePath(`/admin/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/bibliografia`)
    revalidatePath("/admin/dashboard/past-debates")
    revalidatePath("/debates")
}

async function uploadBibliographyDocAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const row = await db.query.debate.findFirst({
        where: and(eq(debate.id, debateId), eq(debate.status, "FINISHED")),
        columns: { id: true },
    })
    if (!row) throw new Error("Debate no encontrado")

    const title = formData.get("title")
    if (typeof title !== "string" || title.trim().length === 0) {
        throw new Error("El titulo es obligatorio")
    }

    const description = formData.get("description")
    const descValue = typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null

    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Debes seleccionar un archivo PDF")
    }

    if (file.size > 20 * 1024 * 1024) {
        throw new Error("El archivo no puede superar los 20 MB")
    }

    if (file.type !== "application/pdf") {
        throw new Error("Solo se permiten archivos PDF")
    }

    const storagePath = `${debateId}/${Date.now()}-${file.name}`
    await uploadDebateDoc(file, storagePath)

    const now = new Date()
    await db.insert(debateBibliographyDoc).values({
        id: crypto.randomUUID(),
        debateId,
        title: title.trim(),
        description: descValue,
        fileName: file.name,
        storagePath,
        createdAt: now,
        updatedAt: now,
    })

    revalidatePath(`/admin/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/bibliografia`)
    revalidatePath("/admin/dashboard/past-debates")
}

async function deleteBibliographyDocAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const docId = formData.get("docId")
    if (typeof docId !== "string" || docId.length === 0) {
        throw new Error("Documento no encontrado")
    }

    const doc = await db.query.debateBibliographyDoc.findFirst({
        where: eq(debateBibliographyDoc.id, docId),
        columns: { id: true, storagePath: true, debateId: true },
    })

    if (!doc) throw new Error("Documento no encontrado")

    await deleteDebateDoc(doc.storagePath)

    await db.delete(debateBibliographyDoc).where(eq(debateBibliographyDoc.id, docId))

    revalidatePath(`/admin/dashboard/past-debates/${doc.debateId}`)
    revalidatePath(`/debates/${doc.debateId}/bibliografia`)
    revalidatePath("/admin/dashboard/past-debates")
}

export default async function PastDebateEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const debateRow = await getFinishedDebateById(id)

    if (!debateRow) {
        notFound()
    }

    const summaryBlocks: SummaryBlockData[] = debateRow.summaryBlocks.map((b) => ({
        id: b.id,
        team: b.team,
        content: b.content,
    }))

    const bibliographyLinks: BibliographyLinkData[] = debateRow.bibliography.map((b) => ({
        id: b.id,
        label: b.label,
        url: b.url,
    }))

    const bibliographyDocs: BibliographyDocData[] = debateRow.bibliographyDocs.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        fileName: d.fileName,
        url: getDebateDocPublicUrl(d.storagePath),
    }))

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6">
            <DashboardHeader
                title={debateRow.title}
                badge="Finalizado"
                description={debateRow.subtitle}
            />
            <PastDebateEditClient
                debateId={debateRow.id}
                initialBlocks={summaryBlocks}
                bibliographyLinks={bibliographyLinks}
                bibliographyDocs={bibliographyDocs}
                saveSummaryAction={saveSummaryBlocksAction}
                saveLinksAction={saveBibliographyLinksAction}
                uploadDocAction={uploadBibliographyDocAction}
                deleteDocAction={deleteBibliographyDocAction}
            />
        </section>
    )
}
