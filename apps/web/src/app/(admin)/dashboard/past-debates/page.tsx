import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import { getFinishedDebates } from "@/lib/debates"
import { deleteDebateDoc } from "@/lib/supabase-storage"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { PastDebatesClient, type PastDebateRow } from "./past-debates-client"

async function deleteDebateAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const debate = await prisma.debate.findFirst({
        where: { id: debateId, status: "FINISHED" },
        include: {
            bibliographyDocs: { select: { storagePath: true } },
        },
    })

    if (!debate) throw new Error("Debate no encontrado")

    for (const doc of debate.bibliographyDocs) {
        try {
            await deleteDebateDoc(doc.storagePath)
        } catch {
            // continuar aunque falle la eliminacion del archivo
        }
    }

    await prisma.debate.delete({ where: { id: debateId } })

    revalidatePath("/dashboard/past-debates")
    revalidatePath("/debates")
    revalidatePath("/debates/archivo")
}

export default async function PastDebatesPage() {
    const debates = await getFinishedDebates()

    const rows: PastDebateRow[] = debates.map((d) => ({
        id: d.id,
        title: d.title,
        subtitle: d.subtitle,
        endAt: d.endAt.toISOString(),
        summaryBlockCount: d._count.summaryBlocks,
        bibliographyLinkCount: d._count.bibliography,
        bibliographyDocCount: d._count.bibliographyDocs,
    }))

    return (
        <section className="mx-auto w-full max-w-5xl space-y-6">
            <DashboardHeader
                title="Debates Anteriores"
                description="Gestiona el resumen y la bibliografia de los debates finalizados."
            />
            <PastDebatesClient debates={rows} deleteAction={deleteDebateAction} />
        </section>
    )
}
