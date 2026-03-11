"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, FileText, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PublicPastDebate } from "@/lib/debates"

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
})

function ArchiveCard({ debate, index }: { debate: PublicPastDebate; index: number }) {
    return (
        <motion.div {...fadeIn(0.05 * (index + 1))}>
            <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                        Finalizado
                    </Badge>
                    <span className="text-xs text-muted-foreground">{debate.dateLabel}</span>
                </div>

                <h3 className="mb-1 text-lg font-bold leading-tight text-foreground">
                    {debate.title}
                </h3>
                <p className="mb-2 text-sm font-medium text-secondary-foreground">
                    {debate.subtitle}
                </p>
                <p className="mb-6 grow text-sm italic text-muted-foreground">
                    &ldquo;{debate.quote}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <Link
                        href={`/debates/${debate.id}/resumen`}
                        className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <FileText className="size-3.5" />
                        Resumen
                    </Link>
                    <Link
                        href={`/debates/${debate.id}/bibliografia`}
                        className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <BookOpen className="size-3.5" />
                        Bibliografia
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}

export function ArchivoClient({ debates }: { debates: PublicPastDebate[] }) {
    return (
        <section className="mx-auto max-w-6xl px-4 pb-24">
            <motion.div {...fadeIn(0)}>
                <Link
                    href="/debates"
                    className="my-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Volver a debates
                </Link>

                <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
                    Archivo de Debates
                </h1>
            </motion.div>

            {debates.length === 0 ? (
                <motion.div
                    {...fadeIn(0.15)}
                    className="rounded-xl border border-border bg-card p-10 text-center"
                >
                    <p className="text-muted-foreground">
                        No hay debates finalizados aun.
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {debates.map((debate, i) => (
                        <ArchiveCard key={debate.id} debate={debate} index={i} />
                    ))}
                </div>
            )}
        </section>
    )
}
