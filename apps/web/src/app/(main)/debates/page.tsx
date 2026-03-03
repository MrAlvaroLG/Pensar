"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Clock,
    CalendarDays,
    Gavel,
    Shield,
    Users,
    ArrowRight,
    FileText,
    BookOpen,
    PlayCircle,
} from "lucide-react"
import BlurText from "@/components/text/blur"
import { motion } from "framer-motion"
import Link from "next/link"
import { nextDebate, pastDebates, type PastDebate } from "./data"

/* ── Animations ────────────────────────────────────────────── */

const BLUR_FROM = { filter: "blur(10px)", opacity: 0, y: -50 }
const BLUR_TO = [
    { filter: "blur(5px)", opacity: 0.5, y: 5 },
    { filter: "blur(0px)", opacity: 1, y: 0 },
]

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
})

/* ── Sub-components ────────────────────────────────────────── */

function ThesisCard() {
    return (
        <motion.div
            {...fadeIn(0.3)}
            className="relative mt-8 w-full max-w-2xl rounded-xl border border-border bg-card/50 p-8 shadow-sm backdrop-blur-sm"
        >
            <span className="absolute left-4 top-3 font-serif text-5xl text-muted-foreground/20">
                &ldquo;
            </span>
            <p className="text-lg font-medium text-foreground">
                {nextDebate.thesis}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                <span>{nextDebate.date}</span>
            </div>
        </motion.div>
    )
}

function TeamCard({
    team,
    delay,
}: {
    team: "red" | "blue"
    delay: number
}) {
    const isRed = team === "red"

    const config = {
        red: {
            icon: Gavel,
            title: "Unirse al Equipo Rojo",
            description: "Defender la moción: Debatir como titular o reserva.",
            accentText: "text-red-700",
            accentBg: "bg-red-700",
            accentBgLight: "bg-red-50 dark:bg-red-900/20",
            hoverText: "group-hover:text-red-700",
            barPosition: "left-0",
            align: "text-start",
        },
        blue: {
            icon: Shield,
            title: "Unirse al Equipo Azul",
            description: "Oponerse a la moción: Debatir como titular o reserva.",
            accentText: "text-blue-700",
            accentBg: "bg-blue-700",
            accentBgLight: "bg-blue-50 dark:bg-blue-900/20",
            hoverText: "group-hover:text-blue-700",
            barPosition: "right-0",
            align: "text-end",
        },
    }[team]

    const Icon = config.icon

    return (
        <motion.div {...fadeIn(delay)}>
            <Link
                href="/signup"
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${!isRed ? "text-right" : ""}`}
            >
                <div className={`absolute ${config.barPosition} top-0 h-full w-1 ${config.accentBg}`} />

                <div className={`mb-4 flex size-10 items-center justify-center rounded-full ${config.accentBgLight} ${config.accentText} ${!isRed ? "ml-auto" : ""}`}>
                    <Icon className="size-5" />
                </div>

                <div className={`flex flex-col ${config.align}`}>
                    <h3 className={`text-xl font-bold text-foreground transition-colors ${config.hoverText}`}>
                        {config.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {config.description}
                    </p>
                </div>

                <div className={`mt-4 flex items-center text-sm font-semibold ${config.accentText} ${!isRed ? "justify-end" : ""}`}>
                    Registrarse
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
        </motion.div>
    )
}

function AudienceCard() {
    return (
        <motion.div {...fadeIn(0.6)} className="md:col-span-2">
            <Link
                href="/signup"
                className="group flex flex-col items-center justify-between gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6 md:flex-row"
            >
                <div className="flex w-full flex-col items-center gap-3 md:flex-row md:gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Users className="size-6" />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-foreground md:text-xl">
                            Asistir como Público
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                            Escuchar los argumentos y participar en la sesión de Preguntas.
                        </p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-center text-xs font-semibold text-foreground md:justify-end md:text-sm">
                    Reservar lugar
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
        </motion.div>
    )
}

function PastDebateCard({ debate, index }: { debate: PastDebate; index: number }) {
    return (
        <motion.div {...fadeIn(0.1 * (index + 1))}>
            <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                        Finalizado
                    </Badge>
                    <span className="text-xs text-muted-foreground">{debate.date}</span>
                </div>

                <h3 className="mb-2 text-lg font-bold leading-tight text-foreground">
                    {debate.title}
                </h3>
                <p className="mb-6 grow text-sm italic text-muted-foreground">
                    &ldquo;{debate.quote}&rdquo;
                </p>

                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                        <FileText className="size-3.5" />
                        Resumen
                    </button>
                    <button className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                        <BookOpen className="size-3.5" />
                        Bibliografía
                    </button>
                    <button className="ml-auto flex items-center gap-1.5 rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30">
                        <PlayCircle className="size-3.5" />
                        Grabación
                    </button>
                </div>
            </div>
        </motion.div>
    )
}


export default function DebatesPage() {
    return (
        <div className="relative overflow-hidden">
            <section className="mx-auto max-w-6xl px-4 pb-24">
                <div className="flex flex-col items-center text-center">
                    <motion.div {...fadeIn(0)}>
                        <Badge variant="secondary" className="mt-8 text-sm">
                            <Clock className="size-3.5" />
                            Próximo Debate
                        </Badge>
                    </motion.div>

                    <div className="mt-6 max-w-4xl px-4 md:px-0">
                        <BlurText
                            text={nextDebate.title}
                            className="text-4xl font-bold text-foreground md:text-6xl"
                            animateBy="words"
                            direction="top"
                            animationFrom={BLUR_FROM}
                            animationTo={BLUR_TO}
                            easing="easeOut"
                        />
                        <BlurText
                            text={nextDebate.subtitle}
                            className="text-balance pt-2 text-center text-lg font-bold text-secondary-foreground md:text-5xl"
                            animateBy="words"
                            direction="top"
                            delay={100}
                            animationFrom={BLUR_FROM}
                            animationTo={BLUR_TO}
                            easing="easeOut"
                        />
                        <BlurText
                            text={nextDebate.question}
                            className="pt-4 text-center text-base text-muted-foreground md:text-xl"
                            animateBy="words"
                            direction="top"
                            delay={200}
                            animationFrom={BLUR_FROM}
                            animationTo={BLUR_TO}
                            easing="easeOut"
                        />
                    </div>

                    <ThesisCard />

                    <div className="relative mt-10 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-red-500/15 blur-[100px]" />
                        <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[100px]" />

                        <TeamCard team="red" delay={0.4} />
                        <TeamCard team="blue" delay={0.5} />
                        <AudienceCard />
                    </div>
                </div>
            </section>

            <Separator className="mx-auto max-w-6xl" />

            <section className="mx-auto max-w-6xl px-4 py-16">
                <motion.div {...fadeIn(0)}>
                    <div className="mb-8 flex flex-col items-start justify-between">
                        <h2 className="text-2xl font-bold text-foreground">
                            Debates Anteriores
                        </h2>
                        <Link
                            href="/debates/archivo"
                            className="flex items-center gap-1 pt-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Ver todo el archivo
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {pastDebates.map((debate, i) => (
                            <PastDebateCard key={debate.id} debate={debate} index={i} />
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    )
}