"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Upload, Plus, Pencil, X, Check, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export interface CategoryRow {
    id: string
    name: string
    icon: string
    order: number
    _count: { documents: number }
}

export interface DocumentRow {
    id: string
    title: string
    description: string | null
    fileName: string
    categoryId: string
    createdAt: string
}

interface LibraryClientProps {
    categories: CategoryRow[]
    documents: DocumentRow[]
    createCategoryAction: (formData: FormData) => Promise<void>
    updateCategoryAction: (formData: FormData) => Promise<void>
    deleteCategoryAction: (formData: FormData) => Promise<void>
    deleteDocumentAction: (formData: FormData) => Promise<void>
}

function CategorySection({
    categories,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
}: Pick<LibraryClientProps, "categories" | "createCategoryAction" | "updateCategoryAction" | "deleteCategoryAction">) {
    const [pending, startTransition] = useTransition()
    const createFormRef = useRef<HTMLFormElement>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")

    const handleCreate = (formData: FormData) => {
        startTransition(async () => {
            await createCategoryAction(formData)
            createFormRef.current?.reset()
        })
    }

    const handleStartEdit = (cat: CategoryRow) => {
        setEditingId(cat.id)
        setEditName(cat.name)
    }

    const handleSaveEdit = () => {
        if (!editingId) return
        const formData = new FormData()
        formData.set("categoryId", editingId)
        formData.set("name", editName)
        startTransition(async () => {
            await updateCategoryAction(formData)
            setEditingId(null)
        })
    }

    const handleDelete = (categoryId: string) => {
        const formData = new FormData()
        formData.set("categoryId", categoryId)
        startTransition(() => deleteCategoryAction(formData))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Categorías</h2>
            </div>

            <form ref={createFormRef} action={handleCreate} className="flex items-center gap-2">
                <Input
                    name="name"
                    placeholder="Nueva categoría..."
                    required
                    className="max-w-xs"
                    disabled={pending}
                />
                <Button type="submit" size="sm" disabled={pending}>
                    <Plus className="mr-1 size-4" />
                    Crear
                </Button>
            </form>

            {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay categorías creadas.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="w-32">Documentos</TableHead>
                            <TableHead className="w-32">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell>
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="h-8 max-w-xs"
                                                disabled={pending}
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8"
                                                onClick={handleSaveEdit}
                                                disabled={pending}
                                            >
                                                <Check className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8"
                                                onClick={() => setEditingId(null)}
                                                disabled={pending}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        cat.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{cat._count.documents}</Badge>
                                </TableCell>
                                <TableCell>
                                    {editingId !== cat.id && (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8"
                                                onClick={() => handleStartEdit(cat)}
                                                disabled={pending}
                                            >
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive size-8"
                                                onClick={() => handleDelete(cat.id)}
                                                disabled={pending || cat._count.documents > 0}
                                                title={cat._count.documents > 0 ? "Elimina los documentos primero" : "Eliminar categoría"}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

function UploadSection({
    categories,
    documents,
    deleteDocumentAction,
}: Pick<LibraryClientProps, "categories" | "documents" | "deleteDocumentAction">) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const uploadFormRef = useRef<HTMLFormElement>(null)
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = uploadFormRef.current
        if (!form || uploading) return

        setUploadError(null)
        setUploading(true)
        setUploadProgress(0)

        const formData = new FormData(form)

        await new Promise<void>((resolve) => {
            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener("progress", (progressEvent) => {
                if (!progressEvent.lengthComputable) return
                const nextProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
                setUploadProgress(nextProgress)
            })

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setUploadProgress(100)
                    form.reset()
                    setSelectedFile(null)
                    setDialogOpen(false)
                    router.refresh()
                    resolve()
                    return
                }

                try {
                    const response = JSON.parse(xhr.responseText) as { error?: string }
                    setUploadError(response.error ?? "No se pudo subir el archivo")
                } catch {
                    setUploadError("No se pudo subir el archivo")
                }
                resolve()
            })

            xhr.addEventListener("error", () => {
                setUploadError("Error de red durante la subida")
                resolve()
            })

            xhr.addEventListener("abort", () => {
                setUploadError("La subida fue cancelada")
                resolve()
            })

            xhr.open("POST", "/api/admin/library/upload")
            xhr.send(formData)
        })

        setUploading(false)
    }

    const handleDelete = (docId: string) => {
        const formData = new FormData()
        formData.set("documentId", docId)
        startTransition(() => deleteDocumentAction(formData))
    }

    const getCategoryName = (categoryId: string) =>
        categories.find((c) => c.id === categoryId)?.name ?? "Sin categoría"

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Documentos</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" disabled={categories.length === 0}>
                            <Upload className="mr-1 size-4" />
                            Subir PDF
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Subir documento PDF</DialogTitle>
                        </DialogHeader>
                        <form ref={uploadFormRef} onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Título</label>
                                <Input name="title" placeholder="Título del documento" required disabled={pending || uploading} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripción (opcional)</label>
                                <Textarea name="description" placeholder="Breve descripción del documento..." disabled={pending || uploading} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoría</label>
                                <Select name="categoryId" required disabled={pending || uploading}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Archivo PDF</label>
                                <Input
                                    type="file"
                                    name="file"
                                    accept="application/pdf"
                                    required
                                    disabled={pending || uploading}
                                    onChange={(e) => setSelectedFile(e.target.files?.[0]?.name ?? null)}
                                />
                                {selectedFile && (
                                    <p className="text-muted-foreground text-xs">
                                        Archivo seleccionado: {selectedFile}
                                    </p>
                                )}
                            </div>

                            {uploading && (
                                <div className="space-y-1.5">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full rounded-full bg-primary transition-[width] duration-150"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-xs">Subiendo: {uploadProgress}%</p>
                                </div>
                            )}

                            {uploadError && (
                                <p className="text-destructive text-sm">{uploadError}</p>
                            )}

                            <Button type="submit" disabled={pending || uploading} className="w-full">
                                {uploading ? `Subiendo... ${uploadProgress}%` : "Subir documento"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {categories.length === 0 && (
                <p className="text-muted-foreground text-sm">Crea una categoría primero para poder subir documentos.</p>
            )}

            {documents.length === 0 && categories.length > 0 ? (
                <p className="text-muted-foreground text-sm">No hay documentos subidos.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Archivo</TableHead>
                            <TableHead className="w-24">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{doc.title}</p>
                                        {doc.description && (
                                            <p className="text-muted-foreground text-xs">{doc.description}</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{getCategoryName(doc.categoryId)}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm">
                                        <FileText className="text-muted-foreground size-4" />
                                        <span className="max-w-40 truncate">{doc.fileName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="text-destructive size-8"
                                        onClick={() => handleDelete(doc.id)}
                                        disabled={pending}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export function LibraryClient({
    categories,
    documents,
    createCategoryAction,
    updateCategoryAction,
    deleteCategoryAction,
    deleteDocumentAction,
}: LibraryClientProps) {
    return (
        <div className="space-y-8">
            <CategorySection
                categories={categories}
                createCategoryAction={createCategoryAction}
                updateCategoryAction={updateCategoryAction}
                deleteCategoryAction={deleteCategoryAction}
            />
            <UploadSection
                categories={categories}
                documents={documents}
                deleteDocumentAction={deleteDocumentAction}
            />
        </div>
    )
}
