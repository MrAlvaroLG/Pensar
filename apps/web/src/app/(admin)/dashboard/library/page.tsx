import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import { uploadPdf, deletePdf } from "@/lib/supabase-storage"
import { LibraryClient } from "./library-client"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

async function createCategoryAction(formData: FormData) {
    "use server"
    await ensureAdminSession()

    const name = formData.get("name")
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio")
    }

    const existing = await prisma.libraryCategory.findUnique({
        where: { name: name.trim() },
    })
    if (existing) {
        throw new Error("Ya existe una categoría con ese nombre")
    }

    const maxOrder = await prisma.libraryCategory.aggregate({
        _max: { order: true },
    })

    await prisma.libraryCategory.create({
        data: {
            name: name.trim(),
            order: (maxOrder._max.order ?? -1) + 1,
        },
    })

    revalidatePath("/dashboard/library")
}

async function updateCategoryAction(formData: FormData) {
    "use server"
    await ensureAdminSession()

    const categoryId = formData.get("categoryId")
    const name = formData.get("name")

    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido")
    }
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio")
    }

    const duplicate = await prisma.libraryCategory.findFirst({
        where: { name: name.trim(), NOT: { id: categoryId } },
    })
    if (duplicate) {
        throw new Error("Ya existe otra categoría con ese nombre")
    }

    await prisma.libraryCategory.update({
        where: { id: categoryId },
        data: { name: name.trim() },
    })

    revalidatePath("/dashboard/library")
}

async function deleteCategoryAction(formData: FormData) {
    "use server"
    await ensureAdminSession()

    const categoryId = formData.get("categoryId")
    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido")
    }

    const docCount = await prisma.libraryDocument.count({
        where: { categoryId },
    })
    if (docCount > 0) {
        throw new Error("No se puede eliminar una categoría con documentos")
    }

    await prisma.libraryCategory.delete({
        where: { id: categoryId },
    })

    revalidatePath("/dashboard/library")
}

async function uploadDocumentAction(formData: FormData) {
    "use server"
    await ensureAdminSession()

    const title = formData.get("title")
    const description = formData.get("description")
    const categoryId = formData.get("categoryId")
    const file = formData.get("file")

    if (typeof title !== "string" || title.trim().length === 0) {
        throw new Error("El título es obligatorio")
    }
    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("Selecciona una categoría")
    }
    if (!(file instanceof File) || file.size === 0) {
        throw new Error("Selecciona un archivo PDF")
    }
    if (file.type !== "application/pdf") {
        throw new Error("Solo se permiten archivos PDF")
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("El archivo no puede superar los 20 MB")
    }

    const category = await prisma.libraryCategory.findUnique({
        where: { id: categoryId },
    })
    if (!category) {
        throw new Error("La categoría no existe")
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const storagePath = `${categoryId}/${timestamp}-${safeName}`

    await uploadPdf(file, storagePath)

    await prisma.libraryDocument.create({
        data: {
            title: title.trim(),
            description: typeof description === "string" && description.trim().length > 0
                ? description.trim()
                : null,
            fileName: file.name,
            storagePath,
            categoryId,
        },
    })

    revalidatePath("/dashboard/library")
}

async function deleteDocumentAction(formData: FormData) {
    "use server"
    await ensureAdminSession()

    const documentId = formData.get("documentId")
    if (typeof documentId !== "string" || documentId.length === 0) {
        throw new Error("ID de documento inválido")
    }

    const doc = await prisma.libraryDocument.findUnique({
        where: { id: documentId },
    })
    if (!doc) {
        throw new Error("El documento no existe")
    }

    await deletePdf(doc.storagePath)

    await prisma.libraryDocument.delete({
        where: { id: documentId },
    })

    revalidatePath("/dashboard/library")
}

export default async function LibraryPage() {
    await ensureAdminSession()

    const categories = await prisma.libraryCategory.findMany({
        include: { _count: { select: { documents: true } } },
        orderBy: { order: "asc" },
    })

    const documents = await prisma.libraryDocument.findMany({
        orderBy: { createdAt: "desc" },
    })

    const serializedCategories = categories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        order: c.order,
        _count: c._count,
    }))

    const serializedDocuments = documents.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        fileName: d.fileName,
        categoryId: d.categoryId,
        createdAt: d.createdAt.toISOString(),
    }))

    return (
        <LibraryClient
            categories={serializedCategories}
            documents={serializedDocuments}
            createCategoryAction={createCategoryAction}
            updateCategoryAction={updateCategoryAction}
            deleteCategoryAction={deleteCategoryAction}
            uploadDocumentAction={uploadDocumentAction}
            deleteDocumentAction={deleteDocumentAction}
        />
    )
}
