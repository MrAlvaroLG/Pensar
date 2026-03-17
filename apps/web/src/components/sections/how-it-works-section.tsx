"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Flag, MessageCircleMore, Scale } from "lucide-react"

import BlurText from "@/components/text/blur"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StepItem {
    id: string
    title: string
    description: string
    detail: string
    Icon: typeof Scale
}

const blurAnimation = {
    from: { filter: "blur(10px)", opacity: 0, y: -30 },
    to: [
        { filter: "blur(5px)", opacity: 0.5, y: 4 },
        { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
}

const steps: StepItem[] = [
    {
        id: "1",
        title: "Inscríbete con una postura",
        description: "Cada encuentro publica una moción clara. Te inscribes eligiendo equipo y postura de forma explícita.",
        detail: "La moción se anuncia con 10-14 días de antelación para que todos puedan prepararse bien.",
        Icon: Flag,
    },
    {
        id: "2",
        title: "Prepárate con tu equipo",
        description: "Construyan su caso con lógica, fuentes verificables y una línea argumental ordenada para cada ronda.",
        detail: "Cada equipo cuenta con titulares y reservas para mantener continuidad y claridad en la exposición.",
        Icon: MessageCircleMore,
    },
    {
        id: "3",
        title: "Debate con orden y respeto",
        description: "El moderador dirige tiempos, turnos y preguntas del público para que el diálogo sea claro y formativo.",
        detail: "No hay ganadores ni puntuación: el objetivo es comprender mejor, crecer y sobre todo PENSAR.",
        Icon: Scale,
    },
]

export default function HowItWorksSection() {
    return (
        <section className="relative overflow-hidden bg-background px-4 py-24 md:px-6 md:py-30">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-900/8 blur-3xl dark:bg-white/8" />
                <div className="absolute left-0 top-1/2 h-64 w-64 -translate-x-16 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-64 w-64 translate-x-16 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[44px_44px] opacity-[0.025]" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <Badge variant="outline" className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[11px] uppercase tracking-[0.28em] backdrop-blur-sm">
                            Cómo funciona
                        </Badge>
                    </motion.div>

                    <BlurText
                        text="Tres pasos para pasar de una idea a un debate sólido"
                        className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
                        animateBy="words"
                        direction="top"
                        delay={80}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />

                    <BlurText
                        text="Un formato mensual, moderado y estructurado para defender ideas teológicas con razón, fuentes y respeto."
                        className="text-balance text-sm font-medium text-secondary-foreground md:text-lg"
                        animateBy="words"
                        direction="top"
                        delay={30}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.65, delay: index * 0.09, ease: "easeOut" }}
                            className="relative"
                        >
                            <Card className="relative h-full overflow-hidden border-border/70 bg-background/80 shadow-xl shadow-black/5 backdrop-blur-sm">
                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent" />
                                <CardContent className="flex h-full flex-col gap-5 p-6 md:p-7">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">PASO {step.id}</span>
                                        <span className="inline-flex rounded-full border border-border/70 bg-background p-2 text-muted-foreground">
                                            <step.Icon className="size-4" />
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                                        {step.title}
                                    </h3>

                                    <p className="text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                                        {step.description}
                                    </p>

                                    <p className="mt-auto rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-sm leading-6 text-secondary-foreground">
                                        {step.detail}
                                    </p>
                                </CardContent>
                            </Card>

                            {index < steps.length - 1 ? (
                                <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                                    <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-2 py-1 text-muted-foreground backdrop-blur-sm">
                                        <ArrowRight className="size-4" />
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    <Button asChild variant="outline" size="lg" className="border-border/70 bg-background/70 sm:min-w-44">
                        <Link href="/formato-y-reglas">Ver formato y reglas</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
