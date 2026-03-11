import { notFound } from "next/navigation"
import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import { getFinishedDebateById } from "@/lib/debates"
import { isSummaryBlockTeam, type SummaryBlockTeam } from "@/lib/debate-domain"
import { uploadDebateDoc, deleteDebateDoc, getDebateDocPublicUrl } from "@/lib/supabase-storage"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { PastDebateEditClient, type SummaryBlockData, type BibliographyLinkData, type BibliographyDocData } from "./past-debate-edit-client"

async function saveSummaryBlocksAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const debate = await prisma.debate.findFirst({
        where: { id: debateId, status: "FINISHED" },
        select: { id: true },
    })
    if (!debate) throw new Error("Debate no encontrado")

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

    await prisma.$transaction([
        prisma.debateSummaryBlock.deleteMany({ where: { debateId } }),
        ...validated.map((b) =>
            prisma.debateSummaryBlock.create({
                data: {
                    debateId,
                    team: b.team,
                    content: b.content,
                    order: b.order,
                },
            })
        ),
    ])

    revalidatePath(`/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/resumen`)
    revalidatePath("/dashboard/past-debates")
    revalidatePath("/debates")
}

async function saveBibliographyLinksAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const debate = await prisma.debate.findFirst({
        where: { id: debateId, status: "FINISHED" },
        select: { id: true },
    })
    if (!debate) throw new Error("Debate no encontrado")

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

    await prisma.$transaction([
        prisma.debateBibliography.deleteMany({ where: { debateId } }),
        ...validated.map((l) =>
            prisma.debateBibliography.create({
                data: {
                    debateId,
                    label: l.label,
                    url: l.url,
                },
            })
        ),
    ])

    revalidatePath(`/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/bibliografia`)
    revalidatePath("/dashboard/past-debates")
    revalidatePath("/debates")
}

async function uploadBibliographyDocAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const debate = await prisma.debate.findFirst({
        where: { id: debateId, status: "FINISHED" },
        select: { id: true },
    })
    if (!debate) throw new Error("Debate no encontrado")

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

    await prisma.debateBibliographyDoc.create({
        data: {
            debateId,
            title: title.trim(),
            description: descValue,
            fileName: file.name,
            storagePath,
        },
    })

    revalidatePath(`/dashboard/past-debates/${debateId}`)
    revalidatePath(`/debates/${debateId}/bibliografia`)
    revalidatePath("/dashboard/past-debates")
}

async function deleteBibliographyDocAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const docId = formData.get("docId")
    if (typeof docId !== "string" || docId.length === 0) {
        throw new Error("Documento no encontrado")
    }

    const doc = await prisma.debateBibliographyDoc.findUnique({
        where: { id: docId },
        select: { id: true, storagePath: true, debateId: true },
    })

    if (!doc) throw new Error("Documento no encontrado")

    await deleteDebateDoc(doc.storagePath)

    await prisma.debateBibliographyDoc.delete({
        where: { id: docId },
    })

    revalidatePath(`/dashboard/past-debates/${doc.debateId}`)
    revalidatePath(`/debates/${doc.debateId}/bibliografia`)
    revalidatePath("/dashboard/past-debates")
}

export default async function PastDebateEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const debate = await getFinishedDebateById(id)

    if (!debate) {
        notFound()
    }

    const summaryBlocks: SummaryBlockData[] = debate.summaryBlocks.map((b) => ({
        id: b.id,
        team: b.team,
        content: b.content,
    }))

    const bibliographyLinks: BibliographyLinkData[] = debate.bibliography.map((b) => ({
        id: b.id,
        label: b.label,
        url: b.url,
    }))

    const bibliographyDocs: BibliographyDocData[] = debate.bibliographyDocs.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        fileName: d.fileName,
        url: getDebateDocPublicUrl(d.storagePath),
    }))

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6">
            <DashboardHeader
                title={debate.title}
                badge="Finalizado"
                description={debate.subtitle}
            />
            <PastDebateEditClient
                debateId={debate.id}
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
