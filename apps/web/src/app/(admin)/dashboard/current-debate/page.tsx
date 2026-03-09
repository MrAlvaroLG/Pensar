import Link from "next/link"
import prisma, { type DebateStatus } from "@pensar/db"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { DEBATE_STATUS_OPTIONS, getDebateQueue, toDateTimeLocalValue } from "@/lib/debates"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function parseDateField(value: FormDataEntryValue | null, label: string) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`El campo ${label} es obligatorio`)
    }

    const parsed = new Date(value)

    if (Number.isNaN(parsed.getTime())) {
        throw new Error(`El campo ${label} no tiene una fecha válida`)
    }

    return parsed
}

function parseBibliography(rawValue: FormDataEntryValue | null) {
    if (typeof rawValue !== "string" || rawValue.trim().length === 0) {
        return []
    }

    return rawValue
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            const [rawLabel, rawUrl] = line.includes("|")
                ? line.split("|", 2)
                : [`Referencia ${index + 1}`, line]

            const label = rawLabel.trim()
            const url = rawUrl.trim()

            try {
                const validUrl = new URL(url)
                return {
                    label,
                    url: validUrl.toString(),
                }
            } catch {
                throw new Error(`La referencia ${index + 1} no tiene una URL válida`)
            }
        })
}

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

    await prisma.debate.update({
        where: {
            id: debateId,
        },
        data: {
            title: title.trim(),
            subtitle: subtitle.trim(),
            question: question.trim(),
            thesis: thesis.trim(),
            startAt,
            endAt,
            status,
            bibliography: {
                deleteMany: {},
                create: bibliography,
            },
        },
    })

    revalidatePath("/debates")
    revalidatePath("/dashboard/current-debate")
    revalidatePath("/dashboard/upcoming-debate")
}

export default async function CurrentDebatePage() {
    const queue = await getDebateQueue()
    const currentDebate = queue[0] ?? null

    if (!currentDebate) {
        return (
            <section className="space-y-4">
                <h1 className="text-2xl font-semibold">Debate Actual</h1>
                <p className="text-muted-foreground">
                    No hay debate activo o programado para editar.
                </p>
                <Button asChild>
                    <Link href="/dashboard/upcoming-debate">Agendar próximo debate</Link>
                </Button>
            </section>
        )
    }

    const bibliographyValue = currentDebate.bibliography
        .map((item) => `${item.label} | ${item.url}`)
        .join("\n")

    return (
        <section className="mx-auto w-full max-w-4xl space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">Debate Actual</h1>
                    <Badge variant="secondary">{currentDebate.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    Edita el debate que actualmente se muestra al público. Guardar aplica cambios de inmediato.
                </p>
            </div>

            <form action={updateCurrentDebateAction} className="space-y-5 rounded-xl border border-border bg-card p-5">
                <input type="hidden" name="debateId" value={currentDebate.id} />

                <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">Título</label>
                    <input
                        id="title"
                        name="title"
                        required
                        defaultValue={currentDebate.title}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="subtitle" className="text-sm font-medium">Subtítulo</label>
                    <input
                        id="subtitle"
                        name="subtitle"
                        required
                        defaultValue={currentDebate.subtitle}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="question" className="text-sm font-medium">Pregunta</label>
                    <input
                        id="question"
                        name="question"
                        required
                        defaultValue={currentDebate.question}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="thesis" className="text-sm font-medium">Tesis</label>
                    <textarea
                        id="thesis"
                        name="thesis"
                        required
                        rows={4}
                        defaultValue={currentDebate.thesis}
                        className="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <label htmlFor="startAt" className="text-sm font-medium">Inicio</label>
                        <input
                            id="startAt"
                            name="startAt"
                            type="datetime-local"
                            required
                            defaultValue={toDateTimeLocalValue(currentDebate.startAt)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="endAt" className="text-sm font-medium">Fin</label>
                        <input
                            id="endAt"
                            name="endAt"
                            type="datetime-local"
                            required
                            defaultValue={toDateTimeLocalValue(currentDebate.endAt)}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        />
                    </div>
                </div>

                <div className="grid gap-2 md:max-w-sm">
                    <label htmlFor="status" className="text-sm font-medium">Estado</label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={currentDebate.status}
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        {DEBATE_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid gap-2">
                    <label htmlFor="bibliography" className="text-sm font-medium">
                        Bibliografía (una por línea: Título | URL)
                    </label>
                    <textarea
                        id="bibliography"
                        name="bibliography"
                        rows={5}
                        defaultValue={bibliographyValue}
                        placeholder="Artículo principal | https://dominio.com/recurso"
                        className="min-h-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit">Guardar cambios</Button>
                </div>
            </form>
        </section>
    )
}
