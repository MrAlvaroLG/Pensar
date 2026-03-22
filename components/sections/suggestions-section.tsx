"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lightbulb, Send } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { Badge } from "@/ui/badge"
import { Button } from "@/ui/button"
import { Card, CardContent } from "@/ui/card"
import { Label } from "@/ui/label"

const SUBJECT_MAX = 120
const MESSAGE_MAX = 1200

export default function SuggestionsSection() {
    const { data: session, isPending } = authClient.useSession()
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const isLoggedIn = !!session?.user

    const isValid = useMemo(() => {
        return subject.trim().length >= 4 && message.trim().length >= 10
    }, [subject, message])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!isValid || isSubmitting) {
            return
        }

        setIsSubmitting(true)
        setStatus(null)

        try {
            const response = await fetch("/api/suggestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subject, message }),
            })

            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                setStatus({
                    type: "error",
                    text: payload.error ?? "No se pudo enviar tu sugerencia. Intentalo otra vez.",
                })
                return
            }

            setSubject("")
            setMessage("")
            setStatus({
                type: "success",
                text: "Gracias. Tu sugerencia fue enviada al equipo organizador.",
            })
        } catch {
            setStatus({
                type: "error",
                text: "Ocurrio un error de red al enviar tu mensaje.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="relative overflow-hidden bg-background px-4 py-20 md:px-6 md:py-24">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-0 top-20 h-64 w-64 -translate-x-16 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-0 bottom-10 h-64 w-64 translate-x-16 rounded-full bg-red-500/10 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[46px_46px] opacity-[0.02]" />
            </div>

            <div className="relative mx-auto flex max-w-4xl flex-col gap-6">
                <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                    <Badge variant="outline" className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[11px] uppercase tracking-[0.28em] backdrop-blur-sm">
                        Sugerencias de la comunidad
                    </Badge>
                    <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Ayudanos a mejorar PENSAR
                    </h2>
                    <p className="text-balance text-sm font-medium text-secondary-foreground md:text-lg">
                        Si tienes ideas para mejorar la plataforma, puedes enviarlas al equipo organizador.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Card className="border-border/70 bg-background/80 shadow-xl shadow-black/5">
                        <CardContent className="p-6 md:p-7">
                            {!isPending && !isLoggedIn ? (
                                <div className="space-y-4 text-center">
                                    <p className="text-sm text-muted-foreground md:text-base">
                                        Debes iniciar sesion para enviar sugerencias al equipo administrador.
                                    </p>
                                    <Button asChild>
                                        <Link href="/login">Iniciar sesion</Link>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="suggestion-subject">Asunto</Label>
                                        <input
                                            id="suggestion-subject"
                                            value={subject}
                                            onChange={(event) => setSubject(event.target.value)}
                                            maxLength={SUBJECT_MAX}
                                            placeholder="Ej: Mejoras en la seccion de debates"
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">{subject.length}/{SUBJECT_MAX}</p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="suggestion-message">Mensaje</Label>
                                        <textarea
                                            id="suggestion-message"
                                            value={message}
                                            onChange={(event) => setMessage(event.target.value)}
                                            maxLength={MESSAGE_MAX}
                                            rows={6}
                                            placeholder="Comparte tu idea, consejo o cambio que te gustaria ver."
                                            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">{message.length}/{MESSAGE_MAX}</p>
                                    </div>

                                    {status ? (
                                        <p className={status.type === "success" ? "text-sm text-emerald-600" : "text-sm text-destructive"}>
                                            {status.text}
                                        </p>
                                    ) : null}

                                    <Button type="submit" disabled={!isValid || isSubmitting || isPending} className="w-full sm:w-auto">
                                        <Send className="mr-2 size-4" />
                                        {isSubmitting ? "Enviando..." : "Enviar sugerencia"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
