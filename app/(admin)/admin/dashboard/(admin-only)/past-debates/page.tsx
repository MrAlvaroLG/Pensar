import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { ensureAdminSession } from "@/lib/admin-auth"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { getFinishedDebates } from "@/lib/debates"
import { db } from "@/lib/db"
import { debate } from "@/lib/db/schema"
import { deleteDebateDoc } from "@/lib/supabase-storage"
import { PastDebatesClient, type PastDebateRow } from "./past-debates-client"

async function deleteDebateAction(formData: FormData) {
    "use server"

    await ensureAdminSession()

    const debateId = formData.get("debateId")
    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const row = await db.query.debate.findFirst({
        where: and(eq(debate.id, debateId), eq(debate.status, "FINISHED")),
        with: {
            bibliographyDocs: { columns: { storagePath: true } },
        },
    })

    if (!row) throw new Error("Debate no encontrado")

    for (const doc of row.bibliographyDocs) {
        try {
            await deleteDebateDoc(doc.storagePath)
        } catch {
            // continuar aunque falle la eliminacion del archivo
        }
    }

    await db.delete(debate).where(eq(debate.id, debateId))

    revalidatePath("/admin/dashboard/past-debates")
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
