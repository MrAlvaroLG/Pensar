import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDebateQueue, toDateTimeLocalValue } from "@/lib/debates"
import { parseDateField, parseBibliography } from "@/lib/debate-form-helpers"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { DebateForm } from "@/components/admin/debate-form"

async function saveUpcomingDebateAction(formData: FormData) {
    "use server"

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }

    const upcomingId = formData.get("upcomingId")
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

    const sharedData = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        question: question.trim(),
        thesis: thesis.trim(),
        startAt,
        endAt,
        status: "SCHEDULED" as const,
        bibliography: {
            deleteMany: {},
            create: bibliography,
        },
    }

    if (typeof upcomingId === "string" && upcomingId.length > 0) {
        await prisma.debate.update({
            where: {
                id: upcomingId,
            },
            data: sharedData,
        })
    } else {
        await prisma.debate.create({
            data: {
                ...sharedData,
                bibliography: {
                    create: bibliography,
                },
            },
        })
    }

    revalidatePath("/debates")
    revalidatePath("/dashboard/current-debate")
    revalidatePath("/dashboard/upcoming-debate")
}

export default async function UpcomingDebatePage() {
    const queue = await getDebateQueue()

    const currentDebate = queue[0] ?? null
    const upcomingDebate = queue[1] ?? null

    const bibliographyValue = upcomingDebate
        ? upcomingDebate.bibliography.map((item) => `${item.label} | ${item.url}`).join("\n")
        : ""

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6">
            <DashboardHeader
                title="Debate Próximo"
                description="Agenda el siguiente debate para que se publique automáticamente cuando termine el actual."
            >
                <p className="text-sm text-muted-foreground">
                    Debate actual: {currentDebate ? currentDebate.title : "Sin debate en cola"}
                </p>
            </DashboardHeader>

            <DebateForm
                action={saveUpcomingDebateAction}
                hiddenFields={[{ name: "upcomingId", value: upcomingDebate?.id ?? "" }]}
                defaultValues={{
                    title: upcomingDebate?.title,
                    subtitle: upcomingDebate?.subtitle,
                    question: upcomingDebate?.question,
                    thesis: upcomingDebate?.thesis,
                    startAt: upcomingDebate ? toDateTimeLocalValue(upcomingDebate.startAt) : undefined,
                    endAt: upcomingDebate ? toDateTimeLocalValue(upcomingDebate.endAt) : undefined,
                    bibliography: bibliographyValue || undefined,
                }}
                submitLabel={upcomingDebate ? "Actualizar próximo debate" : "Crear próximo debate"}
            />
        </section>
    )
}
