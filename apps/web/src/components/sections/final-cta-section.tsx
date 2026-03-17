"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Facebook, Instagram } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const SOCIAL_LINKS = [
    {
        label: "Siguenos en Instagram",
        href: "https://www.instagram.com/pj_camaguey?igsh=MTBoZTE2MW4zdzJuMg==",
        icon: Instagram,
        iconTone: "text-rose-500",
        glowTone: "from-rose-500/12 to-orange-500/10",
    },
    {
        label: "Siguenos en Facebook",
        href: "https://www.facebook.com/share/18DFPB286e/?mibextid=wwXIfr",
        icon: Facebook,
        iconTone: "text-blue-600",
        glowTone: "from-blue-500/12 to-cyan-500/10",
    },
] as const

export default function FinalCtaSection() {
    return (
        <section className="relative overflow-hidden bg-background px-4 py-20 md:px-6 md:py-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-slate-900/8 blur-3xl dark:bg-white/8" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[52px_52px] opacity-[0.02]" />
            </div>

            <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
                <Badge variant="outline" className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[11px] uppercase tracking-[0.28em] backdrop-blur-sm">
                    Comunidad PENSAR
                </Badge>

                <div className="space-y-3">
                    <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Sigue el proyecto y no te pierdas el proximo debate
                    </h2>
                    <p className="text-balance text-sm font-medium text-secondary-foreground md:text-lg">
                        Enterate de nuevas mociones, fechas, contenidos y material posterior en nuestras redes oficiales.
                    </p>
                </div>

                <div className="grid w-full gap-4 md:grid-cols-2">
                    {SOCIAL_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block"
                        >
                            <Card className="relative overflow-hidden border-border/70 bg-background/85 text-left shadow-lg shadow-black/5 transition-all duration-200 group-hover:-translate-y-1 group-hover:border-foreground/20 group-hover:shadow-xl group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-ring">
                                <div className={`pointer-events-none absolute inset-0 bg-linear-to-br ${item.glowTone} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
                                <CardContent className="relative flex min-h-24 items-center justify-between gap-4 p-4 sm:p-5">
                                    <span className={`rounded-full border border-border/70 bg-background p-2.5 transition-colors group-hover:border-foreground/20 ${item.iconTone}`}>
                                        <item.icon className="size-5" />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-balance text-sm font-semibold tracking-tight text-foreground sm:text-base">
                                            {item.label}
                                        </h3>
                                    </div>

                                    <span className="inline-flex shrink-0 items-center rounded-full border border-border/70 bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                                        Abrir
                                        <ArrowUpRight className="ml-1 size-3.5" />
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                >
                    <Button asChild size="lg">
                        <Link href="/debates">Ver debates</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
