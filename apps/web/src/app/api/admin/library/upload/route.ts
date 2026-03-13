import { NextResponse } from "next/server"
import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"

/**
 * Registers a document in the database after the file has been uploaded
 * directly to Supabase Storage by the client via a signed URL (see /api/admin/library/presign).
 * Accepts JSON body: { title, description?, categoryId, fileName, storagePath }
 */
export async function POST(request: Request) {
    try {
        await ensureAdminSession()

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
        // Prevent storagePath tampering: must be scoped to the declared category
        if (!storagePath.startsWith(`${categoryId}/`)) {
            return NextResponse.json({ error: "storagePath inválido" }, { status: 400 })
        }

        const category = await prisma.libraryCategory.findUnique({
            where: { id: categoryId },
            select: { id: true },
        })
        if (!category) {
            return NextResponse.json({ error: "La categoría no existe" }, { status: 404 })
        }

        const document = await prisma.libraryDocument.create({
            data: {
                title: title.trim(),
                description: typeof description === "string" && description.trim().length > 0
                    ? description.trim()
                    : null,
                fileName,
                storagePath,
                categoryId,
            },
            select: {
                id: true,
                title: true,
                fileName: true,
            },
        })

        revalidatePath("/dashboard/library")
        revalidatePath("/docs", "layout")
        revalidatePath("/")

        return NextResponse.json({ ok: true, document }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno al registrar documento"
        const status = message === "No autorizado" ? 401 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
