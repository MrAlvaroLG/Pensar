"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ArrowLeft, Gavel, Shield, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PublicSummaryBlock } from "@/lib/debates"
import type { SummaryBlockTeam } from "@/lib/debate-domain"

const BLOCK_STYLES: Record<SummaryBlockTeam, {
    label: string
    icon: typeof Gavel
    border: string
    bg: string
    text: string
    bar: string
}> = {
    RED: {
        label: "Equipo Rojo",
        icon: Gavel,
        border: "border-red-200 dark:border-red-900/40",
        bg: "bg-red-50/50 dark:bg-red-900/10",
        text: "text-red-700 dark:text-red-400",
        bar: "bg-red-600",
    },
    BLUE: {
        label: "Equipo Azul",
        icon: Shield,
        border: "border-blue-200 dark:border-blue-900/40",
        bg: "bg-blue-50/50 dark:bg-blue-900/10",
        text: "text-blue-700 dark:text-blue-400",
        bar: "bg-blue-600",
    },
    PUBLIC: {
        label: "Preguntas del Publico",
        icon: Users,
        border: "border-slate-200 dark:border-slate-700",
        bg: "bg-slate-50/50 dark:bg-slate-800/20",
        text: "text-slate-700 dark:text-slate-300",
        bar: "bg-slate-500",
    },
}

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
})

export function ResumenClient({
    debateTitle,
    debateSubtitle,
    blocks,
}: {
    debateTitle: string
    debateSubtitle: string
    blocks: PublicSummaryBlock[]
}) {
    const hasContent = blocks.length > 0

    return (
        <section className="mx-auto max-w-4xl px-4 pb-24">
            <motion.div {...fadeIn(0)}>
                <Link
                    href="/debates"
                    className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Volver a debates
                </Link>

                <div className="mb-8">
                    <Badge variant="secondary" className="mb-3 text-xs">
                        Resumen
                    </Badge>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        {debateTitle}
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">{debateSubtitle}</p>
                </div>
            </motion.div>

            {!hasContent ? (
                <motion.div
                    {...fadeIn(0.15)}
                    className="rounded-xl border border-border bg-card p-10 text-center"
                >
                    <p className="text-muted-foreground">
                        Aun no hay documentacion publicada para este debate.
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {blocks.map((block, i) => {
                        const style = BLOCK_STYLES[block.team]
                        const Icon = style.icon

                        return (
                            <motion.div
                                key={block.id}
                                {...fadeIn(0.1 * (i + 1))}
                                className={`relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-6`}
                            >
                                <div className={`absolute left-0 top-0 h-full w-1 ${style.bar}`} />

                                <div className="mb-4 flex items-center gap-2">
                                    <Icon className={`size-5 ${style.text}`} />
                                    <span className={`text-sm font-semibold ${style.text}`}>
                                        {style.label}
                                    </span>
                                </div>

                                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {block.content}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
