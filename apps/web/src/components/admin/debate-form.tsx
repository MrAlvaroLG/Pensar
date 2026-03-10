import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEBATE_STATUS_OPTIONS } from "@/lib/debates"

interface DebateFormProps {
    action: (formData: FormData) => Promise<void>
    hiddenFields?: Array<{ name: string; value: string }>
    defaultValues?: {
        title?: string
        subtitle?: string
        question?: string
        thesis?: string
        startAt?: string
        endAt?: string
        bibliography?: string
        status?: string
    }
    showStatus?: boolean
    submitLabel: string
}

export function DebateForm({
    action,
    hiddenFields,
    defaultValues = {},
    showStatus = false,
    submitLabel,
}: DebateFormProps) {
    return (
        <form action={action} className="space-y-5 rounded-xl border border-border bg-card p-5">
            {hiddenFields?.map((field) => (
                <input key={field.name} type="hidden" name={field.name} value={field.value} />
            ))}

            <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required defaultValue={defaultValues.title ?? ""} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input id="subtitle" name="subtitle" required defaultValue={defaultValues.subtitle ?? ""} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="question">Pregunta</Label>
                <Input id="question" name="question" required defaultValue={defaultValues.question ?? ""} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="thesis">Tesis</Label>
                <Textarea
                    id="thesis"
                    name="thesis"
                    required
                    rows={4}
                    defaultValue={defaultValues.thesis ?? ""}
                    className="min-h-28"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="startAt">Inicio</Label>
                    <Input
                        id="startAt"
                        name="startAt"
                        type="datetime-local"
                        required
                        defaultValue={defaultValues.startAt ?? ""}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="endAt">Fin</Label>
                    <Input
                        id="endAt"
                        name="endAt"
                        type="datetime-local"
                        required
                        defaultValue={defaultValues.endAt ?? ""}
                    />
                </div>
            </div>

            {showStatus && (
                <div className="grid gap-2 md:max-w-sm">
                    <Label htmlFor="status">Estado</Label>
                    <select
                        id="status"
                        name="status"
                        defaultValue={defaultValues.status ?? ""}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        {DEBATE_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="bibliography">
                    Bibliografía (una por línea: Título | URL)
                </Label>
                <Textarea
                    id="bibliography"
                    name="bibliography"
                    rows={5}
                    defaultValue={defaultValues.bibliography ?? ""}
                    placeholder="Artículo principal | https://dominio.com/recurso"
                    className="min-h-32"
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit">{submitLabel}</Button>
            </div>
        </form>
    )
}
