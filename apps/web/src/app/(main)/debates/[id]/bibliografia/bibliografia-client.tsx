"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, FileDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PublicBibliographyLink, PublicBibliographyDoc } from "@/lib/debates"

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
})

export function BibliografiaClient({
    debateTitle,
    debateSubtitle,
    links,
    docs,
}: {
    debateTitle: string
    debateSubtitle: string
    links: PublicBibliographyLink[]
    docs: PublicBibliographyDoc[]
}) {
    const hasContent = links.length > 0 || docs.length > 0

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
                        Bibliografia
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
                <div className="space-y-8">
                    {links.length > 0 && (
                        <motion.div {...fadeIn(0.1)} className="space-y-3">
                            <h2 className="text-lg font-semibold text-foreground">
                                Enlaces
                            </h2>
                            <div className="space-y-2">
                                {links.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground">{link.label}</p>
                                            <p className="truncate text-sm text-muted-foreground">{link.url}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {docs.length > 0 && (
                        <motion.div {...fadeIn(0.2)} className="space-y-3">
                            <h2 className="text-lg font-semibold text-foreground">
                                Documentos
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {docs.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div className="mb-3 flex items-start justify-between">
                                            <p className="font-medium text-foreground">{doc.title}</p>
                                            <FileDown className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                                        </div>
                                        {doc.description && (
                                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </section>
    )
}
