"use client"

import { useTransition } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, BookOpen, ArrowRight, Trash2 } from "lucide-react"

export interface PastDebateRow {
    id: string
    title: string
    subtitle: string
    endAt: string
    summaryBlockCount: number
    bibliographyLinkCount: number
    bibliographyDocCount: number
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
})

export function PastDebatesClient({ debates, deleteAction }: { debates: PastDebateRow[]; deleteAction: (formData: FormData) => Promise<void> }) {
    const [deletePending, startDeleteTransition] = useTransition()

    if (debates.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
                <p className="text-muted-foreground">No hay debates finalizados aun.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {debates.map((debate) => {
                const hasSummary = debate.summaryBlockCount > 0
                const hasBiblio = debate.bibliographyLinkCount > 0 || debate.bibliographyDocCount > 0

                return (
                    <div
                        key={debate.id}
                        className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
                    >
                        <Link
                            href={`/dashboard/past-debates/${debate.id}`}
                            className="min-w-0 flex-1"
                        >
                            <h3 className="truncate text-base font-semibold text-foreground group-hover:underline">
                                {debate.title}
                            </h3>
                            <p className="mt-0.5 truncate text-sm text-muted-foreground">
                                {debate.subtitle}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Finalizado el {DATE_FORMATTER.format(new Date(debate.endAt))}
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                                <Badge
                                    variant={hasSummary ? "default" : "outline"}
                                    className="gap-1 text-xs"
                                >
                                    <FileText className="size-3" />
                                    {hasSummary ? `${debate.summaryBlockCount} bloques` : "Sin resumen"}
                                </Badge>
                                <Badge
                                    variant={hasBiblio ? "default" : "outline"}
                                    className="gap-1 text-xs"
                                >
                                    <BookOpen className="size-3" />
                                    {hasBiblio
                                        ? `${debate.bibliographyLinkCount} enlaces, ${debate.bibliographyDocCount} docs`
                                        : "Sin bibliografia"}
                                </Badge>
                            </div>
                        </Link>
                        <div className="ml-4 flex items-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-9 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Eliminar debate</DialogTitle>
                                        <DialogDescription>
                                            ¿Seguro que quieres eliminar &ldquo;{debate.title}&rdquo;? Se eliminaran el resumen, bibliografia y documentos asociados. Esta accion no se puede deshacer.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex flex-row justify-between">
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Cancelar</Button>
                                        </DialogClose>
                                        <Button
                                            variant="destructive"
                                            disabled={deletePending}
                                            onClick={() => {
                                                const data = new FormData()
                                                data.set("debateId", debate.id)
                                                startDeleteTransition(() => deleteAction(data))
                                            }}
                                        >
                                            {deletePending ? "Eliminando..." : "Eliminar"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
