import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import { deletePdf } from "@/lib/supabase-storage"
import { LibraryClient } from "./library-client"

function revalidateLibraryViews() {
    revalidatePath("/dashboard/library")
    revalidatePath("/docs", "layout")
    revalidatePath("/")
}

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

    revalidateLibraryViews()
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

    revalidateLibraryViews()
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

    revalidateLibraryViews()
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

    revalidateLibraryViews()
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
            deleteDocumentAction={deleteDocumentAction}
        />
    )
}
