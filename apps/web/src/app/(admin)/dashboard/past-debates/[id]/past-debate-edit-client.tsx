"use client"

import { useRef, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    Save,
    Upload,
    ExternalLink,
    FileText,
    BookOpen,
} from "lucide-react"
import { SUMMARY_BLOCK_TEAM_OPTIONS, type SummaryBlockTeam } from "@/lib/debate-domain"

export interface SummaryBlockData {
    id: string
    team: SummaryBlockTeam
    content: string
}

export interface BibliographyLinkData {
    id: string
    label: string
    url: string
}

export interface BibliographyDocData {
    id: string
    title: string
    description: string | null
    fileName: string
    url: string
}

interface LocalBlock {
    key: string
    team: SummaryBlockTeam
    content: string
}

function toLocalBlocks(blocks: SummaryBlockData[]): LocalBlock[] {
    return blocks.map((b) => ({
        key: b.id,
        team: b.team,
        content: b.content,
    }))
}

let blockKeyCounter = 0
function nextBlockKey() {
    return `new-${++blockKeyCounter}`
}

interface LocalLink {
    key: string
    label: string
    url: string
}

function toLocalLinks(links: BibliographyLinkData[]): LocalLink[] {
    return links.map((l) => ({
        key: l.id,
        label: l.label,
        url: l.url,
    }))
}

let linkKeyCounter = 0
function nextLinkKey() {
    return `new-link-${++linkKeyCounter}`
}

interface Props {
    debateId: string
    initialBlocks: SummaryBlockData[]
    bibliographyLinks: BibliographyLinkData[]
    bibliographyDocs: BibliographyDocData[]
    saveSummaryAction: (formData: FormData) => Promise<void>
    saveLinksAction: (formData: FormData) => Promise<void>
    uploadDocAction: (formData: FormData) => Promise<void>
    deleteDocAction: (formData: FormData) => Promise<void>
}

export function PastDebateEditClient({
    debateId,
    initialBlocks,
    bibliographyLinks,
    bibliographyDocs,
    saveSummaryAction,
    saveLinksAction,
    uploadDocAction,
    deleteDocAction,
}: Props) {
    const [blocks, setBlocks] = useState<LocalBlock[]>(() => toLocalBlocks(initialBlocks))
    const [links, setLinks] = useState<LocalLink[]>(() => toLocalLinks(bibliographyLinks))
    const [savePending, startSaveTransition] = useTransition()
    const [saveLinksPending, startSaveLinksTransition] = useTransition()
    const [uploadPending, startUploadTransition] = useTransition()
    const [deletingDocId, setDeletingDocId] = useState<string | null>(null)
    const uploadFormRef = useRef<HTMLFormElement>(null)

    function addBlock() {
        setBlocks((prev) => [
            ...prev,
            { key: nextBlockKey(), team: "RED", content: "" },
        ])
    }

    function removeBlock(index: number) {
        setBlocks((prev) => prev.filter((_, i) => i !== index))
    }

    function moveBlock(index: number, direction: "up" | "down") {
        setBlocks((prev) => {
            const next = [...prev]
            const target = direction === "up" ? index - 1 : index + 1
            if (target < 0 || target >= next.length) return prev
            ;[next[index], next[target]] = [next[target], next[index]]
            return next
        })
    }

    function updateBlockTeam(index: number, team: SummaryBlockTeam) {
        setBlocks((prev) =>
            prev.map((b, i) => (i === index ? { ...b, team } : b))
        )
    }

    function updateBlockContent(index: number, content: string) {
        setBlocks((prev) =>
            prev.map((b, i) => (i === index ? { ...b, content } : b))
        )
    }

    function handleSaveSummary() {
        const data = new FormData()
        data.set("debateId", debateId)
        data.set(
            "blocks",
            JSON.stringify(blocks.map((b) => ({ team: b.team, content: b.content })))
        )
        startSaveTransition(() => saveSummaryAction(data))
    }

    function addLink() {
        setLinks((prev) => [
            ...prev,
            { key: nextLinkKey(), label: "", url: "" },
        ])
    }

    function removeLink(index: number) {
        setLinks((prev) => prev.filter((_, i) => i !== index))
    }

    function updateLinkLabel(index: number, label: string) {
        setLinks((prev) =>
            prev.map((l, i) => (i === index ? { ...l, label } : l))
        )
    }

    function updateLinkUrl(index: number, url: string) {
        setLinks((prev) =>
            prev.map((l, i) => (i === index ? { ...l, url } : l))
        )
    }

    function handleSaveLinks() {
        const data = new FormData()
        data.set("debateId", debateId)
        data.set(
            "links",
            JSON.stringify(links.map((l) => ({ label: l.label, url: l.url })))
        )
        startSaveLinksTransition(() => saveLinksAction(data))
    }

    function handleUploadDoc(formData: FormData) {
        formData.set("debateId", debateId)
        startUploadTransition(async () => {
            await uploadDocAction(formData)
            uploadFormRef.current?.reset()
        })
    }

    function handleDeleteDoc(docId: string) {
        setDeletingDocId(docId)
        const data = new FormData()
        data.set("docId", docId)
        startUploadTransition(async () => {
            await deleteDocAction(data)
            setDeletingDocId(null)
        })
    }

    return (
        <div className="space-y-10">
            {/* ── Resumen del debate ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Resumen del debate</h2>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSaveSummary}
                        disabled={savePending}
                    >
                        <Save className="mr-1.5 size-4" />
                        {savePending ? "Guardando..." : "Guardar resumen"}
                    </Button>
                </div>

                {blocks.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No hay bloques de resumen. Agrega uno para empezar.
                    </p>
                )}

                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <div
                            key={block.key}
                            className="rounded-lg border border-border bg-card p-4 space-y-3"
                        >
                            <div className="flex items-center gap-2">
                                <Select
                                    value={block.team}
                                    onValueChange={(v) => updateBlockTeam(index, v as SummaryBlockTeam)}
                                >
                                    <SelectTrigger className="w-52">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUMMARY_BLOCK_TEAM_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <div className="ml-auto flex items-center gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => moveBlock(index, "up")}
                                        disabled={index === 0}
                                        className="size-8"
                                    >
                                        <ArrowUp className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => moveBlock(index, "down")}
                                        disabled={index === blocks.length - 1}
                                        className="size-8"
                                    >
                                        <ArrowDown className="size-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeBlock(index)}
                                        className="size-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <textarea
                                value={block.content}
                                onChange={(e) => updateBlockContent(index, e.target.value)}
                                placeholder="Escribe el contenido en Markdown..."
                                rows={6}
                                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                    ))}
                </div>

                <Button variant="outline" size="sm" onClick={addBlock}>
                    <Plus className="mr-1.5 size-4" />
                    Agregar bloque
                </Button>
            </div>

            <Separator />

            {/* ── Bibliografia: enlaces ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="size-5 text-muted-foreground" />
                        <h2 className="text-lg font-semibold">Bibliografia — Enlaces</h2>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSaveLinks}
                        disabled={saveLinksPending}
                    >
                        <Save className="mr-1.5 size-4" />
                        {saveLinksPending ? "Guardando..." : "Guardar enlaces"}
                    </Button>
                </div>

                {links.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No hay enlaces de bibliografia. Agrega uno para empezar.
                    </p>
                )}

                <div className="space-y-3">
                    {links.map((link, index) => (
                        <div
                            key={link.key}
                            className="flex items-start gap-2 rounded-lg border border-border bg-card p-3"
                        >
                            <div className="grid flex-1 gap-2 sm:grid-cols-2">
                                <Input
                                    value={link.label}
                                    onChange={(e) => updateLinkLabel(index, e.target.value)}
                                    placeholder="Etiqueta"
                                />
                                <Input
                                    value={link.url}
                                    onChange={(e) => updateLinkUrl(index, e.target.value)}
                                    placeholder="https://..."
                                    type="url"
                                />
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => removeLink(index)}
                                className="size-8 shrink-0 text-destructive hover:text-destructive"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button variant="outline" size="sm" onClick={addLink}>
                    <Plus className="mr-1.5 size-4" />
                    Agregar enlace
                </Button>
            </div>

            <Separator />

            {/* ── Bibliografia: documentos PDF ── */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">Bibliografia — Documentos</h2>
                </div>

                <form
                    ref={uploadFormRef}
                    action={handleUploadDoc}
                    className="rounded-lg border border-border bg-card p-4 space-y-3"
                >
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-title">Titulo</Label>
                            <Input
                                id="doc-title"
                                name="title"
                                placeholder="Nombre del documento"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="doc-description">Descripcion (opcional)</Label>
                            <Input
                                id="doc-description"
                                name="description"
                                placeholder="Breve descripcion"
                            />
                        </div>
                    </div>
                    <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-1.5">
                            <Label htmlFor="doc-file">Archivo PDF</Label>
                            <Input
                                id="doc-file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                required
                            />
                        </div>
                        <Button type="submit" size="sm" disabled={uploadPending}>
                            <Upload className="mr-1.5 size-4" />
                            {uploadPending ? "Subiendo..." : "Subir"}
                        </Button>
                    </div>
                </form>

                {bibliographyDocs.length > 0 && (
                    <div className="space-y-2">
                        {bibliographyDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">{doc.title}</p>
                                    {doc.description && (
                                        <p className="truncate text-xs text-muted-foreground">{doc.description}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                                </div>
                                <div className="ml-3 flex items-center gap-2">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Badge variant="secondary" className="cursor-pointer gap-1">
                                            <ExternalLink className="size-3" />
                                            Ver
                                        </Badge>
                                    </a>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteDoc(doc.id)}
                                        disabled={deletingDocId === doc.id}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
