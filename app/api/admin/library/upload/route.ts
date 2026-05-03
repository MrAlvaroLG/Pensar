import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { ensureLibrarySession } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { libraryCategory, libraryDocument } from "@/lib/db/schema"

/**
 * Registers a document in the database after the file has been uploaded
 * directly to Supabase Storage by the client via a signed URL (see /api/admin/library/presign).
 * Accepts JSON body: { title, description?, categoryId, fileName, storagePath }
 */
export async function POST(request: Request) {
    try {
        await ensureLibrarySession()

        const body = await request.json() as {
            title?: string
            description?: string
            categoryId?: string
            fileName?: string
            storagePath?: string
        }
        const { title, description, categoryId, fileName, storagePath } = body

        if (typeof title !== "string" || title.trim().length === 0) {
            return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
        }
        if (typeof categoryId !== "string" || !categoryId) {
            return NextResponse.json({ error: "Selecciona una categoría" }, { status: 400 })
        }
        if (typeof fileName !== "string" || !fileName) {
            return NextResponse.json({ error: "fileName requerido" }, { status: 400 })
        }
        if (typeof storagePath !== "string" || !storagePath) {
            return NextResponse.json({ error: "storagePath requerido" }, { status: 400 })
        }

        const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
        const storagePathNormalized = storagePath.trim()
        const expectedPattern = new RegExp(
            `^${escapeRegex(categoryId)}/\\\\d+-${escapeRegex(safeName)}$`
        )

        if (!expectedPattern.test(storagePathNormalized)) {
            return NextResponse.json({ error: "storagePath inválido" }, { status: 400 })
        }

        const category = await db.query.libraryCategory.findFirst({
            where: eq(libraryCategory.id, categoryId),
            columns: { id: true },
        })
        if (!category) {
            return NextResponse.json({ error: "La categoría no existe" }, { status: 404 })
        }

        const now = new Date()
        const [document] = await db
            .insert(libraryDocument)
            .values({
                id: crypto.randomUUID(),
                title: title.trim(),
                description:
                    typeof description === "string" && description.trim().length > 0
                        ? description.trim()
                        : null,
                fileName,
                storagePath: storagePathNormalized,
                categoryId,
                createdAt: now,
                updatedAt: now,
            })
            .returning({
                id: libraryDocument.id,
                title: libraryDocument.title,
                fileName: libraryDocument.fileName,
            })

        revalidatePath("/admin/dashboard/library")
        revalidatePath("/library", "layout")
        revalidatePath("/")

        return NextResponse.json({ ok: true, document }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno al registrar documento"
        const status = message === "No autorizado" ? 401 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
