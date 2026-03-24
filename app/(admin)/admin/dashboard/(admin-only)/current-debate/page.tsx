import Link from "next/link"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DebateForm } from "@/components/admin/debate-form"
import { parseBibliography, parseDateField } from "@/lib/debate-form-helpers"
import { getDebateQueue, toDateTimeLocalValue } from "@/lib/debates"
import { db } from "@/lib/db"
import type { DebateStatus } from "@/lib/db/schema"
import { debate, debateBibliography } from "@/lib/db/schema"
import { Button } from "@/ui/button"
function parseDebateStatus(value: FormDataEntryValue | null): DebateStatus {
    if (typeof value !== "string") {
        throw new Error("Estado de debate inválido")
    }

    const allowedValues: DebateStatus[] = ["DRAFT", "SCHEDULED", "LIVE", "FINISHED"]

    if (!allowedValues.includes(value as DebateStatus)) {
        throw new Error("Estado de debate inválido")
    }

    return value as DebateStatus
}

async function updateCurrentDebateAction(formData: FormData) {
    "use server"

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }

    const debateId = formData.get("debateId")

    if (typeof debateId !== "string" || debateId.length === 0) {
        throw new Error("Debate no encontrado")
    }

    const title = formData.get("title")
    const subtitle = formData.get("subtitle")
    const question = formData.get("question")
    const thesis = formData.get("thesis")

    if (
        typeof title !== "string" ||
        typeof subtitle !== "string" ||
        typeof question !== "string" ||
        typeof thesis !== "string" ||
        !title.trim() ||
        !subtitle.trim() ||
        !question.trim() ||
        !thesis.trim()
    ) {
        throw new Error("Todos los campos de contenido son obligatorios")
    }

    const startAt = parseDateField(formData.get("startAt"), "inicio")
    const endAt = parseDateField(formData.get("endAt"), "fin")

    if (endAt <= startAt) {
        throw new Error("La fecha de fin debe ser posterior al inicio")
    }

    const bibliography = parseBibliography(formData.get("bibliography"))
    const status = parseDebateStatus(formData.get("status"))

    const now = new Date()

    await db.transaction(async (tx) => {
        await tx.delete(debateBibliography).where(eq(debateBibliography.debateId, debateId))

        if (bibliography.length > 0) {
            await tx.insert(debateBibliography).values(
                bibliography.map((b) => ({
                    id: crypto.randomUUID(),
                    debateId,
                    label: b.label,
                    url: b.url,
                    createdAt: now,
                }))
            )
        }

        await tx
            .update(debate)
            .set({
                title: title.trim(),
                subtitle: subtitle.trim(),
                question: question.trim(),
                thesis: thesis.trim(),
                startAt,
                endAt,
                status,
                updatedAt: now,
            })
            .where(eq(debate.id, debateId))
    })

    revalidatePath("/debates")
    revalidatePath("/admin/dashboard/current-debate")
    revalidatePath("/admin/dashboard/upcoming-debate")
}

export default async function CurrentDebatePage() {
    const queue = await getDebateQueue()
    const currentDebate = queue[0] ?? null

    if (!currentDebate) {
        return (
            <section className="space-y-4">
                <DashboardHeader
                    title="Debate Actual"
                    description="No hay debate activo o programado para editar."
                />
                <Button asChild>
                    <Link href="/admin/dashboard/upcoming-debate">Agendar próximo debate</Link>
                </Button>
            </section>
        )
    }

    const bibliographyValue = currentDebate.bibliography
        .map((item) => `${item.label} | ${item.url}`)
        .join("\n")

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6">
            <DashboardHeader
                title="Debate Actual"
                badge={currentDebate.status}
                description="Edita el debate que actualmente se muestra al público. Guardar aplica cambios de inmediato."
            />

            <DebateForm
                action={updateCurrentDebateAction}
                hiddenFields={[{ name: "debateId", value: currentDebate.id }]}
                defaultValues={{
                    title: currentDebate.title,
                    subtitle: currentDebate.subtitle,
                    question: currentDebate.question,
                    thesis: currentDebate.thesis,
                    startAt: toDateTimeLocalValue(currentDebate.startAt),
                    endAt: toDateTimeLocalValue(currentDebate.endAt),
                    bibliography: bibliographyValue,
                    status: currentDebate.status,
                }}
                showStatus
                submitLabel="Guardar cambios"
            />
        </section>
    )
}
