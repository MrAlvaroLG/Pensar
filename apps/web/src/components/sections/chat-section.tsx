"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Mic, Paperclip, Radio, Send, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

import BlurText from "@/components/text/blur"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DemoMessage {
    id: string
    author: string
    initials: string
    side: "left" | "right"
    tone: "red" | "blue" | "neutral"
    text: string
    delay: number
}

const blurAnimation = {
    from: { filter: "blur(10px)", opacity: 0, y: -30 },
    to: [
        { filter: "blur(5px)", opacity: 0.5, y: 4 },
        { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
}

const redTeamMessages: DemoMessage[] = [
    {
        id: "r1",
        author: "Ana",
        initials: "AN",
        side: "right",
        tone: "red",
        text: "Que empiece Marco la primera ronda; yo voy detrás.",
        delay: 1200,
    },
    {
        id: "r2",
        author: "Carlos",
        initials: "CA",
        side: "left",
        tone: "neutral",
        text: "Ok, ¿necesitas ayuda con algo?",
        delay: 1500,
    },
    {
        id: "r3",
        author: "Ana",
        initials: "AN",
        side: "right",
        tone: "red",
        text: "Sí, envíame alguna bibliografía relacionada con el tema.",
        delay: 1400,
    },
    {
        id: "r4",
        author: "Carlos",
        initials: "CA",
        side: "left",
        tone: "neutral",
        text: "Perfecto, dame un segundo.",
        delay: 2000,
    },
]

const blueTeamMessages: DemoMessage[] = [
    {
        id: "b1",
        author: "Marta",
        initials: "MA",
        side: "left",
        tone: "neutral",
        text: "Acabo de enviar lo que les comentaba sobre Platón hace un rato.",
        delay: 1300,
    },
    {
        id: "b2",
        author: "Luis",
        initials: "LU",
        side: "right",
        tone: "blue",
        text: "Sí, pero todavía no me convence.",
        delay: 1500,
    },
    {
        id: "b3",
        author: "Marta",
        initials: "MA",
        side: "left",
        tone: "neutral",
        text: "Si lo utilizamos, será complicado que puedan refutarnos.",
        delay: 1600,
    },
    {
        id: "b4",
        author: "Luis",
        initials: "LU",
        side: "right",
        tone: "blue",
        text: "Tienes razón, ¡hagámoslo!",
        delay: 2000,
    },
]

const featureCards = [
    {
        title: "Escribe a tu equipo al instante",
        description: "Envía mensajes, coordina estrategias y responde a tu compañero en segundos, sin interrumpir el debate principal.",
    },
    {
        title: "Comparte archivos y documentos",
        description: "Adjunta PDFs, imágenes o notas directamente en el chat. Tu equipo los verá al momento, sin salir de la sala.",
    },
    {
        title: "Graba y envía notas de voz",
        description: "Si no hay tiempo para escribir, graba un audio rápido. Tu equipo lo escucha cuando pueda, sin perder nada.",
    },
]

function getBubbleClass(tone: DemoMessage["tone"], side: DemoMessage["side"]) {
    if (side === "right") {
        if (tone === "red") {
            return "bg-red-600 text-white"
        }

        if (tone === "blue") {
            return "bg-blue-600 text-white"
        }

        return "bg-primary text-primary-foreground"
    }

    return "bg-background text-foreground"
}

export default function ChatSection() {
    const [activeTeam, setActiveTeam] = useState<"red" | "blue">("red")
    const [visibleCount, setVisibleCount] = useState(1)
    const [isClearing, setIsClearing] = useState(false)

    const currentMessages = activeTeam === "red" ? redTeamMessages : blueTeamMessages
    const visibleMessages = isClearing ? [] : currentMessages.slice(0, visibleCount)
    const nextMessage = !isClearing && visibleCount < currentMessages.length ? currentMessages[visibleCount] : null

    useEffect(() => {
        const messages = activeTeam === "red" ? redTeamMessages : blueTeamMessages

        if (isClearing) {
            const t = window.setTimeout(() => {
                setActiveTeam((prev) => (prev === "red" ? "blue" : "red"))
                setVisibleCount(1)
                setIsClearing(false)
            }, 800)
            return () => window.clearTimeout(t)
        }

        const currentMessage = messages[visibleCount - 1]

        const t = window.setTimeout(() => {
            if (visibleCount < messages.length) {
                setVisibleCount((prev) => prev + 1)
            } else {
                setIsClearing(true)
            }
        }, currentMessage?.delay ?? 1400)

        return () => window.clearTimeout(t)
    }, [visibleCount, isClearing, activeTeam])

    const teamLabel = activeTeam === "red" ? "Equipo Rojo" : "Equipo Azul"
    const teamIndicatorColor = activeTeam === "red" ? "text-red-500" : "text-blue-500"
    const teamBadgeClass =
        activeTeam === "red"
            ? "rounded-full border border-red-200/60 bg-red-500/10 text-red-600 backdrop-blur-sm"
            : "rounded-full border border-blue-200/60 bg-blue-500/10 text-blue-600 backdrop-blur-sm"

    return (
        <section className="relative overflow-hidden bg-background px-4 py-24 md:px-6 md:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-0 top-1/4 h-72 w-72 -translate-x-20 rounded-full bg-blue-500/12 blur-3xl" />
                <div className="absolute right-0 top-16 h-64 w-64 translate-x-16 rounded-full bg-red-500/12 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slate-900/8 blur-3xl dark:bg-white/8" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.03]" />
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
                            Chat en tiempo real
                        </Badge>
                    </motion.div>

                    <BlurText
                        text="Coordina con tu equipo antes y durante el debate"
                        className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
                        animateBy="words"
                        direction="top"
                        delay={90}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />

                    <BlurText
                        text="El chat te conecta con tu equipo al instante. Escribe, comparte archivos y manteneos en sintonía cuando más importa."
                        className="text-balance text-sm font-medium text-secondary-foreground md:text-lg"
                        animateBy="words"
                        direction="top"
                        delay={35}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />
                </div>

                <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                    <motion.div
                        initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                    >
                        <Card className="relative h-full overflow-hidden border-border/70 bg-background/75 shadow-2xl shadow-black/5 backdrop-blur-sm">
                            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent" />
                            <CardContent className="flex h-full flex-col gap-8 p-8 md:p-10">
                                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                    <Sparkles className="size-4" />
                                    Todo lo que puedes hacer desde el chat
                                </div>

                                <div className="space-y-4">
                                    <h3 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                                        Escribe, comparte y coordina sin salir de la conversación.
                                    </h3>
                                    <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                        Desde el chat puedes enviar mensajes, adjuntar archivos, grabar notas de voz y mantener a tu equipo alineado en tiempo real, todo en el mismo lugar.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {featureCards.map((card, index) => (
                                        <motion.div
                                            key={card.title}
                                            initial={{ opacity: 0, x: -18, filter: "blur(10px)" }}
                                            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                            viewport={{ once: true, amount: 0.35 }}
                                            transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                                            className="rounded-[1.5rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/40 p-5"
                                        >
                                            <div className="space-y-2">
                                                <h4 className="text-lg font-semibold tracking-tight text-foreground">
                                                    {card.title}
                                                </h4>
                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button asChild size="lg" className="sm:min-w-44">
                                        <Link href="/chat">Unirte al chat</Link>
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="border-border/70 bg-background/70 sm:min-w-44">
                                        <Link href="/debates">Ver el debate activo</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                    >
                        <Card className="relative h-full overflow-hidden border-border/70 bg-background/80 shadow-xl shadow-black/5 backdrop-blur-sm">
                            <div className="absolute inset-0 bg-linear-to-br from-blue-500/12 via-transparent to-red-500/12" />
                            <CardContent className="relative flex h-full flex-col gap-6 p-6 md:p-8">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                            <Radio className={cn("size-4", teamIndicatorColor)} />
                                            En vivo
                                        </div>
                                        <AnimatePresence mode="wait">
                                            <motion.h4
                                                key={activeTeam}
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl"
                                            >
                                                {teamLabel}
                                            </motion.h4>
                                        </AnimatePresence>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTeam}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Badge className={teamBadgeClass}>
                                                {teamLabel}
                                            </Badge>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/90 p-4 shadow-inner shadow-black/5 backdrop-blur-sm">
                                    <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">Canal del equipo</p>
                                            <p className="text-xs text-muted-foreground">Mensajes, archivos, notas de voz y más</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                            <span className="text-xs text-muted-foreground">conectados</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-1 flex-col overflow-hidden rounded-[1.35rem] border border-border/70 bg-muted/25 p-3">
                                        <div className="min-h-0 flex-1 space-y-3 overflow-hidden">
                                            <AnimatePresence mode="popLayout">
                                                {visibleMessages.map((message) => (
                                                    <motion.div
                                                        key={message.id}
                                                        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                                        exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                                                        transition={{ duration: 0.45, ease: "easeOut" }}
                                                        className={cn(
                                                            "flex gap-3",
                                                            message.side === "right" ? "justify-end" : "justify-start"
                                                        )}
                                                    >
                                                        {message.side === "left" ? (
                                                            <Avatar className="mt-1 border border-border/70 bg-background" size="sm">
                                                                <AvatarFallback>{message.initials}</AvatarFallback>
                                                            </Avatar>
                                                        ) : null}

                                                        <div className={cn("max-w-[78%] space-y-1", message.side === "right" ? "items-end" : "items-start")}>
                                                            <div className={cn("flex items-center gap-2 px-1 text-[11px] text-muted-foreground", message.side === "right" ? "justify-end" : "justify-start")}>
                                                                <span>{message.author}</span>
                                                                <span>ahora</span>
                                                            </div>
                                                            <div
                                                                className={cn(
                                                                    "rounded-2xl border border-border/60 px-4 py-3 text-sm leading-6 shadow-sm",
                                                                    message.side === "right" ? "rounded-tr-sm" : "rounded-tl-sm",
                                                                    getBubbleClass(message.tone, message.side)
                                                                )}
                                                            >
                                                                {message.text}
                                                            </div>
                                                        </div>

                                                        {message.side === "right" ? (
                                                            <Avatar className="mt-1 border border-border/70 bg-background" size="sm">
                                                                <AvatarFallback>{message.initials}</AvatarFallback>
                                                            </Avatar>
                                                        ) : null}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {nextMessage ? (
                                                <motion.div
                                                    key={`typing-${nextMessage.id}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                                    className={cn("flex gap-3", nextMessage.side === "right" ? "justify-end" : "justify-start")}
                                                >
                                                    {nextMessage.side === "left" ? (
                                                        <Avatar className="mt-1 border border-border/70 bg-background" size="sm">
                                                            <AvatarFallback>{nextMessage.initials}</AvatarFallback>
                                                        </Avatar>
                                                    ) : null}
                                                    <div className="space-y-1">
                                                        <div className={cn("px-1 text-[11px] text-muted-foreground", nextMessage.side === "right" ? "text-right" : "")}>
                                                            {nextMessage.author} escribiendo...
                                                        </div>
                                                        <div className={cn(
                                                            "flex items-center gap-1.5 rounded-2xl border border-border/60 bg-background px-4 py-3 shadow-sm",
                                                            nextMessage.side === "right" ? "rounded-tr-sm" : "rounded-tl-sm"
                                                        )}>
                                                            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/45" />
                                                            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/45 [animation-delay:150ms]" />
                                                            <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/45 [animation-delay:300ms]" />
                                                        </div>
                                                    </div>
                                                    {nextMessage.side === "right" ? (
                                                        <Avatar className="mt-1 border border-border/70 bg-background" size="sm">
                                                            <AvatarFallback>{nextMessage.initials}</AvatarFallback>
                                                        </Avatar>
                                                    ) : null}
                                                </motion.div>
                                            ) : null}
                                        </div>

                                        <div className="mt-4 rounded-[1.15rem] border border-border/70 bg-background/85 p-3 backdrop-blur-sm">
                                            <div className="flex items-center gap-2">
                                                <button type="button" className="rounded-full border border-border/70 p-2 text-muted-foreground">
                                                    <Paperclip className="size-4" />
                                                </button>
                                                <div className="flex-1 rounded-full border border-border/70 bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
                                                </div>
                                                <button type="button" className="rounded-full border border-border/70 p-2 text-muted-foreground">
                                                    <Mic className="size-4" />
                                                </button>
                                                <button type="button" className="rounded-full bg-primary p-2 text-primary-foreground shadow-sm">
                                                    <Send className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}