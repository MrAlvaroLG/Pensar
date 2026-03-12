"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
    BookOpenText,
    ChevronRight,
    Download,
    FileText,
    FolderOpen,
    Landmark,
    LibraryBig,
    Scale,
    ScrollText,
} from "lucide-react"

import BlurText from "@/components/text/blur"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface LibraryDocument {
    id: string
    title: string
    description: string | null
}

interface LibraryCategory {
    id: string
    name: string
    icon: string
    documents: LibraryDocument[]
    _count: {
        documents: number
    }
}

interface Props {
    categories: LibraryCategory[]
}

const blurAnimation = {
    from: { filter: "blur(10px)", opacity: 0, y: -30 },
    to: [
        { filter: "blur(5px)", opacity: 0.5, y: 4 },
        { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
}

const iconMap = {
    FolderOpen,
    FileText,
    BookOpenText,
    ScrollText,
    Scale,
    Landmark,
}

function resolveIcon(iconName: string) {
    return iconMap[iconName as keyof typeof iconMap] ?? FolderOpen
}

function buildPreviewLines(title?: string) {
    if (!title) {
        return [
            "Documento listo para abrir",
            "Selecciona una categoría",
            "Elige un archivo",
            "Lee el PDF en el visor",
        ]
    }

    const words = title.split(" ").slice(0, 12)
    const midpoint = Math.max(3, Math.ceil(words.length / 2))

    return [
        words.slice(0, midpoint).join(" "),
        words.slice(midpoint).join(" ") || "Lectura inmediata en la biblioteca",
        "El documento se abre directamente",
        "y permanece disponible para descarga",
    ]
}

export default function LibrarySectionClient({ categories }: Props) {
    const topCategories = [...categories]
        .sort((left, right) => right._count.documents - left._count.documents)
        .slice(0, 2)
    const totalDocuments = categories.reduce((sum, category) => sum + category._count.documents, 0)
    const featuredCategory = topCategories[0] ?? categories[0]
    const featuredDocument = featuredCategory?.documents[0]
    const previewLines = buildPreviewLines(featuredDocument?.title)

    return (
        <section className="relative overflow-hidden bg-background px-4 py-24 md:px-6 md:py-32">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-10 h-56 w-56 -translate-x-[140%] rounded-full bg-red-500/12 blur-3xl" />
                <div className="absolute right-0 top-1/3 h-72 w-72 -translate-x-10 rounded-full bg-blue-500/12 blur-3xl" />
                <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-slate-900/6 blur-3xl dark:bg-white/8" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.035]" />
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
                            Biblioteca
                        </Badge>
                    </motion.div>

                    <BlurText
                        text="Documentos ordenados para entrar, abrir y leer al instante"
                        className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
                        animateBy="words"
                        direction="top"
                        delay={90}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />

                    <BlurText
                        text="La biblioteca de Pensar organiza documentos por categorías y te lleva directo al visor. Sin capas extra: eliges un archivo, lo lees y, si lo necesitas, lo descargas."
                        className="text-balance text-sm font-medium text-secondary-foreground md:text-lg"
                        animateBy="words"
                        direction="top"
                        delay={35}
                        animationFrom={blurAnimation.from}
                        animationTo={blurAnimation.to}
                        easing="easeOut"
                    />
                </div>

                {categories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                    >
                        <Card className="relative overflow-hidden border-border/70 bg-background/75 shadow-2xl shadow-black/5 backdrop-blur-sm">
                            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-10">
                                <div className="rounded-3xl border border-border/70 bg-background/85 p-4 backdrop-blur-sm">
                                    <LibraryBig className="size-6" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                                        La biblioteca se está preparando.
                                    </h3>
                                    <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                        Cuando haya documentos disponibles, esta sección mostrará las categorías reales y el acceso directo al visor.
                                    </p>
                                </div>
                                <Button asChild size="lg">
                                    <Link href="/docs">Ir a la biblioteca</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                        <motion.div
                            initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.75, ease: "easeOut" }}
                        >
                            <Card className="relative overflow-hidden border-border/70 bg-background/75 shadow-2xl shadow-black/5 backdrop-blur-sm">
                                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/30 to-transparent" />
                                <CardContent className="flex h-full flex-col gap-8 p-8 md:p-10">
                                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                        <LibraryBig className="size-4" />
                                        Categorías reales y acceso directo al documento
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                                            La biblioteca no se explica: se recorre.
                                        </h3>
                                        <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                            Aquí ves todas las categorías disponibles en la biblioteca, pero el detalle se centra en las dos que ahora mismo concentran más documentos.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="rounded-2xl border border-border/70 bg-white/65 p-4 backdrop-blur-sm dark:bg-black/15">
                                            <div className="text-2xl font-semibold tracking-tight text-foreground">
                                                {categories.length}
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                categorías visibles
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-border/70 bg-white/65 p-4 backdrop-blur-sm dark:bg-black/15">
                                            <div className="text-2xl font-semibold tracking-tight text-foreground">
                                                {totalDocuments}
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                documentos listados
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-border/70 bg-white/65 p-4 backdrop-blur-sm dark:bg-black/15">
                                            <div className="text-2xl font-semibold tracking-tight text-foreground">
                                                PDF
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                lectura inmediata
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {topCategories.map((category, index) => {
                                            const Icon = resolveIcon(category.icon)

                                            return (
                                                <motion.div
                                                    key={category.id}
                                                    initial={{ opacity: 0, x: -20, filter: "blur(12px)" }}
                                                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                                    viewport={{ once: true, amount: 0.35 }}
                                                    transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
                                                >
                                                    <div className="rounded-[1.5rem] border border-border/70 bg-linear-to-br from-background via-background to-muted/40 p-5">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="rounded-2xl border border-border/70 bg-background/90 p-3 shadow-sm">
                                                                    <Icon className="size-5" />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                                                                            {category.name}
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {category._count.documents} {category._count.documents === 1 ? "documento" : "documentos"}
                                                                        </p>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        {category.documents.slice(0, 2).map((document) => (
                                                                            <div key={document.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                                <FileText className="size-3.5" />
                                                                                <span className="line-clamp-1">{document.title}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Badge variant="secondary" className="rounded-full bg-background/75 backdrop-blur-sm">
                                                                0{index + 1}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button asChild size="lg" className="sm:min-w-44">
                                            <Link href="/docs">Entrar en la biblioteca</Link>
                                        </Button>
                                        {featuredDocument ? (
                                            <Button asChild variant="outline" size="lg" className="border-border/70 bg-background/70 sm:min-w-44">
                                                <Link href={`/docs/${featuredDocument.id}`}>Abrir un documento</Link>
                                            </Button>
                                        ) : null}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24, filter: "blur(16px)" }}
                            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.75, ease: "easeOut" }}
                        >
                            <Card className="relative h-full overflow-hidden border-border/70 bg-background/80 shadow-xl shadow-black/5 backdrop-blur-sm">
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/12 via-transparent to-red-500/10" />
                                <CardContent className="relative flex h-full flex-col gap-6 p-6 md:p-8">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                                                Vista del lector
                                            </p>
                                            <h4 className="mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                                                El documento se abre sin salir del flujo.
                                            </h4>
                                        </div>
                                        <div className="rounded-2xl border border-border/70 bg-background/85 p-3 backdrop-blur-sm">
                                            <BookOpenText className="size-5" />
                                        </div>
                                    </div>

                                    <div className="rounded-[1.75rem] border border-border/70 bg-background/90 p-4 shadow-inner shadow-black/5 backdrop-blur-sm">
                                        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-4">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="outline" className="rounded-full bg-background/70">
                                                        {featuredCategory?.name ?? "Biblioteca"}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {featuredDocument ? "Documento disponible ahora" : "Visor listo para usar"}
                                                    </span>
                                                </div>
                                                <h5 className="text-base font-semibold text-foreground md:text-lg">
                                                    {featuredDocument?.title ?? "Selecciona un documento desde la barra lateral"}
                                                </h5>
                                                <p className="text-sm leading-6 text-muted-foreground">
                                                    {featuredDocument?.description ?? "La biblioteca organiza los PDFs por categoría y abre cada archivo dentro del visor del sitio."}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-border/70 bg-background p-2">
                                                <Download className="size-4 text-muted-foreground" />
                                            </div>
                                        </div>

                                        <div className="mt-5 space-y-4">
                                            <div className="rounded-[1.35rem] border border-border/70 bg-muted/35 p-5">
                                                <div className="mx-auto flex max-w-76 flex-col gap-3 rounded-[1.1rem] border border-border/70 bg-background px-5 py-6 shadow-lg shadow-black/5">
                                                    <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
                                                    {previewLines.map((line, index) => (
                                                        <div key={`${line}-${index}`} className="space-y-2">
                                                            <div
                                                                className="h-2 rounded-full bg-foreground/8"
                                                                style={{ width: `${92 - index * 11}%` }}
                                                            />
                                                            <p className="text-[11px] text-muted-foreground/90">
                                                                {line}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    <div className="mt-2 h-24 rounded-2xl border border-dashed border-border/70 bg-linear-to-br from-blue-500/8 to-red-500/8" />
                                                </div>
                                            </div>

                                            <div className="rounded-[1.35rem] border border-border/70 bg-background/80 p-4">
                                                <div className="flex items-center justify-between gap-4 text-sm">
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-foreground">Ruta real de lectura</p>
                                                        <p className="text-muted-foreground">
                                                            Categoría, documento y visor PDF en una navegación continua.
                                                        </p>
                                                    </div>
                                                    <div className="hidden items-center gap-2 text-muted-foreground sm:flex">
                                                        <span>Docs</span>
                                                        <ChevronRight className="size-4" />
                                                        <span>Documento</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </div>
        </section>
    )
}