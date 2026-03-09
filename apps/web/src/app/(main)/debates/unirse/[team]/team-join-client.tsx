"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowLeft, CheckCircle2, Gavel, Shield, Users } from "lucide-react"
import type { DebateTeam, ViewerTeam } from "@/lib/debate-domain"
import type { PublicDebate } from "@/lib/debates"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface TeamJoinClientProps {
    selectedTeam: DebateTeam
    viewerTeam: ViewerTeam
    isLoggedIn: boolean
    highlightedDebate: PublicDebate | null
}

const TEAM_COPY: Record<DebateTeam, {
    title: string
    roleLabel: string
    roleDescription: string
    irreversibleDescription: string
    accentClass: string
    cardClass: string
    buttonClass: string
    icon: typeof Gavel
}> = {
    red: {
        title: "Equipo Rojo",
        roleLabel: "Ataca la mocion",
        roleDescription: "Tu mision es cuestionar la mocion, detectar debilidades y refutar la defensa del equipo azul.",
        irreversibleDescription: "Al confirmar, no podras pasar a azul ni a publico.",
        accentClass: "text-red-700",
        cardClass: "border-red-300/50 bg-red-50/70",
        buttonClass: "bg-red-700 text-white hover:bg-red-800",
        icon: Gavel,
    },
    blue: {
        title: "Equipo Azul",
        roleLabel: "Defiende la mocion",
        roleDescription: "Tu mision es sostener la mocion con argumentos, evidencia y respuestas a los ataques del rojo.",
        irreversibleDescription: "Al confirmar, no podras pasar a rojo ni a publico.",
        accentClass: "text-blue-700",
        cardClass: "border-blue-300/50 bg-blue-50/70",
        buttonClass: "bg-blue-700 text-white hover:bg-blue-800",
        icon: Shield,
    },
    public: {
        title: "Publico",
        roleLabel: "Observa y hace preguntas",
        roleDescription: "Escuchas ambos equipos y participas en la ronda final de preguntas para profundizar el debate.",
        irreversibleDescription: "Al confirmar, no podras pasar al equipo rojo ni azul.",
        accentClass: "text-slate-700",
        cardClass: "border-slate-300/50 bg-slate-50/70",
        buttonClass: "bg-slate-800 text-white hover:bg-slate-900",
        icon: Users,
    },
}

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: "easeOut" as const },
})

function TeamChosenView({ viewerTeam }: { viewerTeam: DebateTeam }) {
    const info = TEAM_COPY[viewerTeam]

    return (
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <CheckCircle2 className={`mx-auto size-10 ${info.accentClass}`} />
            <h1 className="mt-4 text-3xl font-bold text-foreground">Ya estas inscrito</h1>
            <p className={`mt-3 text-lg font-semibold ${info.accentClass}`}>
                Elegiste {info.title}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                Esta seleccion es irreversible. Los otros equipos se mantienen ocultos para tu cuenta.
            </p>
            <Button asChild className="mt-6">
                <Link href="/debates">Volver a debates</Link>
            </Button>
        </div>
    )
}

export function TeamJoinClient({
    selectedTeam,
    viewerTeam,
    isLoggedIn,
    highlightedDebate,
}: TeamJoinClientProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPendingDialog, setShowPendingDialog] = useState(false)

    if (viewerTeam !== "none") {
        return <TeamChosenView viewerTeam={viewerTeam} />
    }

    const teamInfo = TEAM_COPY[selectedTeam]
    const Icon = teamInfo.icon

    const handleJoinTeam = async () => {
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch("/api/debates/team", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ team: selectedTeam }),
            })

            const payload = await response.json().catch(() => ({}))

            if (!response.ok) {
                setError(payload.error ?? "No se pudo completar la inscripcion")
                return
            }

            setShowPendingDialog(true)
        } catch {
            setError("Error de red. Intenta nuevamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-8">
            <motion.div {...fadeIn(0)} className="mb-6">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/debates">
                        <ArrowLeft className="size-4" />
                        Volver
                    </Link>
                </Button>
            </motion.div>

            {!isLoggedIn && (
                <motion.div
                    {...fadeIn(0.05)}
                    className="mb-6 rounded-xl border border-border bg-card p-5"
                >
                    <h2 className="text-lg font-semibold text-foreground">Inicia sesion para continuar</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Debes autenticarte para bloquear tu equipo en el sistema.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/login">Iniciar sesion</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/signup">Crear cuenta</Link>
                        </Button>
                    </div>
                </motion.div>
            )}

            <motion.div
                {...fadeIn(0.1)}
                className={`rounded-2xl border p-6 md:p-8 ${teamInfo.cardClass}`}
            >
                <Badge variant="secondary">Seleccion de equipo</Badge>
                <div className="mt-4 flex items-start gap-3">
                    <div className="rounded-full bg-background p-3">
                        <Icon className={`size-6 ${teamInfo.accentClass}`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Unirte a {teamInfo.title}</h1>
                        <p className={`mt-1 text-sm font-semibold ${teamInfo.accentClass}`}>
                            {teamInfo.roleLabel}
                        </p>
                        <p className="mt-2 text-sm text-foreground/90">{teamInfo.roleDescription}</p>
                    </div>
                </div>

                {highlightedDebate && (
                    <div className="mt-6 rounded-xl border border-border bg-background/80 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">Mocion actual</p>
                        <h2 className="mt-1 text-xl font-semibold text-foreground">
                            {highlightedDebate.subtitle}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {highlightedDebate.question}
                        </p>
                        <p className="mt-2 text-sm text-foreground">{highlightedDebate.thesis}</p>
                    </div>
                )}

                <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-50 p-4 text-amber-900">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold">Accion irreversible</p>
                            <p className="mt-1 text-sm">
                                {teamInfo.irreversibleDescription}
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                        type="button"
                        onClick={handleJoinTeam}
                        disabled={isSubmitting || !isLoggedIn}
                        className={`min-w-44 ${teamInfo.buttonClass}`}
                    >
                        {isSubmitting ? "Confirmando..." : `Confirmar ${teamInfo.title}`}
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/debates">Cancelar</Link>
                    </Button>
                </div>
            </motion.div>

            <Dialog
                open={showPendingDialog}
                onOpenChange={(open) => {
                    setShowPendingDialog(open)
                    if (!open) {
                        router.push("/debates")
                        router.refresh()
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inscripcion enviada</DialogTitle>
                        <DialogDescription>
                            Quedaste inscrito correctamente. Tu estado actual es <strong>Participante</strong> y estás pendiente a ser confirmado por administración como <strong>Orador</strong> o <strong>Reserva</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                setShowPendingDialog(false)
                                router.push("/debates")
                                router.refresh()
                            }}
                        >
                            Entendido
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    )
}
