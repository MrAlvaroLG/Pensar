import { revalidatePath } from "next/cache"
import { and, asc, count, desc, eq, max, ne } from "drizzle-orm"

import { ensureLibrarySession } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { libraryCategory, libraryDocument } from "@/lib/db/schema"
import { deletePdf } from "@/lib/supabase-storage"
import { LibraryClient } from "./library-client"

function revalidateLibraryViews() {
    revalidatePath("/admin/dashboard/library")
    revalidatePath("/library", "layout")
    revalidatePath("/")
}

async function createCategoryAction(formData: FormData) {
    "use server"
    await ensureLibrarySession()

    const name = formData.get("name")
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio")
    }

    const existing = await db.query.libraryCategory.findFirst({
        where: eq(libraryCategory.name, name.trim()),
    })
    if (existing) {
        throw new Error("Ya existe una categoría con ese nombre")
    }

    const [agg] = await db.select({ v: max(libraryCategory.order) }).from(libraryCategory)
    const now = new Date()

    await db.insert(libraryCategory).values({
        id: crypto.randomUUID(),
        name: name.trim(),
        order: (agg?.v ?? -1) + 1,
        createdAt: now,
        updatedAt: now,
    })

    revalidateLibraryViews()
}

async function updateCategoryAction(formData: FormData) {
    "use server"
    await ensureLibrarySession()

    const categoryId = formData.get("categoryId")
    const name = formData.get("name")

    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido")
    }
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new Error("El nombre de la categoría es obligatorio")
    }

    const duplicate = await db.query.libraryCategory.findFirst({
        where: and(
            eq(libraryCategory.name, name.trim()),
            ne(libraryCategory.id, categoryId)
        ),
    })
    if (duplicate) {
        throw new Error("Ya existe otra categoría con ese nombre")
    }

    await db
        .update(libraryCategory)
        .set({ name: name.trim(), updatedAt: new Date() })
        .where(eq(libraryCategory.id, categoryId))

    revalidateLibraryViews()
}

async function deleteCategoryAction(formData: FormData) {
    "use server"
    await ensureLibrarySession()

    const categoryId = formData.get("categoryId")
    if (typeof categoryId !== "string" || categoryId.length === 0) {
        throw new Error("ID de categoría inválido")
    }

    const [row] = await db
        .select({ n: count() })
        .from(libraryDocument)
        .where(eq(libraryDocument.categoryId, categoryId))

    if (row && row.n > 0) {
        throw new Error("No se puede eliminar una categoría con documentos")
    }

    await db.delete(libraryCategory).where(eq(libraryCategory.id, categoryId))

    revalidateLibraryViews()
}

async function deleteDocumentAction(formData: FormData) {
    "use server"
    await ensureLibrarySession()

    const documentId = formData.get("documentId")
    if (typeof documentId !== "string" || documentId.length === 0) {
        throw new Error("ID de documento inválido")
    }

    const doc = await db.query.libraryDocument.findFirst({
        where: eq(libraryDocument.id, documentId),
    })
    if (!doc) {
        throw new Error("El documento no existe")
    }

    await deletePdf(doc.storagePath)

    await db.delete(libraryDocument).where(eq(libraryDocument.id, documentId))

    revalidateLibraryViews()
}

export default async function LibraryPage() {
    await ensureLibrarySession()

    const categoriesRaw = await db.query.libraryCategory.findMany({
        orderBy: [asc(libraryCategory.order)],
        with: {
            documents: { columns: { id: true } },
        },
    })

    const documents = await db.query.libraryDocument.findMany({
        orderBy: [desc(libraryDocument.createdAt)],
    })

    const serializedCategories = categoriesRaw.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        order: c.order,
        _count: { documents: c.documents.length },
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
