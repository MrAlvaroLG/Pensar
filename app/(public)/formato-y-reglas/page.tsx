import { Clock3, FileCheck2, Megaphone, Scale, ShieldAlert, Users } from "lucide-react"

import { Badge } from "@/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import SuggestionsSection from "@/components/sections/suggestions-section"

const pilares = [
    "Crear un espacio para pensar y opinar con libertad.",
    "Formar oradores capaces de defender ideas teologicas con logica, fuentes y respeto.",
    "Promover la diversidad de ideas.",
]

const estructura = [
    "Debate formal entre Equipo Rojo y Equipo Azul.",
    "Cada equipo: 3 oradores titulares + 2 reservas.",
    "Frecuencia mensual, horario orientativo 14:00-17:00.",
    "Mocion oficial publicada 10-14 dias antes del encuentro.",
]

const reglas = [
    "Respeto estricto al tiempo y a los turnos de palabra.",
    "No interrupciones durante intervenciones.",
    "No ataques personales ni lenguaje ofensivo.",
    "Afirmaciones factuales con fuentes verificables y fecha.",
]

const moderador = [
    "Presentar mocion y reglas al inicio.",
    "Abrir y cerrar turnos de palabra.",
    "Controlar tiempos y aplicar cortes cuando sea necesario.",
    "Seleccionar y administrar preguntas del publico.",
    "Restablecer orden y resolver incidencias logisticas.",
]

const proceso = [
    {
        title: "1. Inscripcion",
        description: "Cada participante se registra indicando equipo y postura que desea defender.",
    },
    {
        title: "2. Preparacion",
        description: "Equipos construyen su argumentacion con bibliografia y fuentes verificables.",
    },
    {
        title: "3. Debate formal",
        description: "Rondas de apertura, refutacion y cierre bajo moderacion activa.",
    },
    {
        title: "4. Preguntas del publico",
        description: "Seccion final con preguntas directas administradas por el moderador.",
    },
]

export default function FormatoYReglasPage() {
    return (
        <>
            <main className="relative overflow-hidden bg-background px-4 py-24 md:px-6 md:py-30">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-0 top-1/4 h-72 w-72 -translate-x-20 rounded-full bg-blue-500/10 blur-3xl" />
                    <div className="absolute right-0 top-20 h-64 w-64 translate-x-16 rounded-full bg-red-500/10 blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[44px_44px] opacity-[0.02]" />
                </div>

                <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
                <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
                    <Badge variant="outline" className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[11px] uppercase tracking-[0.28em] backdrop-blur-sm">
                        Formato y reglas
                    </Badge>
                    <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                        Todo lo esencial del proyecto PENSAR
                    </h1>
                    <p className="text-balance text-sm font-medium text-secondary-foreground md:text-lg">
                        Un espacio mensual para dialogar sobre fe y razon con estructura formal,
                        respeto y fuentes verificables.
                    </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Megaphone className="size-5" />
                                Vision y objetivos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-base">
                                {pilares.map((item) => (
                                    <li key={item}>- {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Clock3 className="size-5" />
                                Formato general
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-base">
                                {estructura.map((item) => (
                                    <li key={item}>- {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Users className="size-5" />
                                Flujo del encuentro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3 md:grid-cols-2">
                            {proceso.map((item) => (
                                <div key={item.title} className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                                    <p className="text-sm font-semibold text-foreground md:text-base">{item.title}</p>
                                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Scale className="size-5" />
                                Rol del moderador
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-base">
                                {moderador.map((item) => (
                                    <li key={item}>- {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <ShieldAlert className="size-5" />
                                Reglas de conducta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-base">
                                {reglas.map((item) => (
                                    <li key={item}>- {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <Card className="border-border/70 bg-background/80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileCheck2 className="size-5" />
                                Transparencia y bibliografia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-7 text-muted-foreground md:text-base">
                                Se recomienda que cada equipo entregue las referencias utilizadas
                                (libros, articulos o documentos). Para afirmaciones importantes, se debe
                                indicar fuente y año. El objetivo es asegurar debates honestos, claros y
                                verificables.
                            </p>
                        </CardContent>
                    </Card>
                </section>
                </div>
            </main>

            <SuggestionsSection />
        </>
    )
}
