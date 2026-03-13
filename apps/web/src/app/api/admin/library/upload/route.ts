import { NextResponse } from "next/server"
import prisma from "@pensar/db"
import { revalidatePath } from "next/cache"
import { ensureAdminSession } from "@/lib/admin-auth"
import { uploadPdf } from "@/lib/supabase-storage"

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB

export async function POST(request: Request) {
    try {
        await ensureAdminSession()

        const formData = await request.formData()
        const title = formData.get("title")
        const description = formData.get("description")
        const categoryId = formData.get("categoryId")
        const file = formData.get("file")

        if (typeof title !== "string" || title.trim().length === 0) {
            return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 })
        }
        if (typeof categoryId !== "string" || categoryId.length === 0) {
            return NextResponse.json({ error: "Selecciona una categoría" }, { status: 400 })
        }
        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json({ error: "Selecciona un archivo PDF" }, { status: 400 })
        }
        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "Solo se permiten archivos PDF" }, { status: 400 })
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "El archivo no puede superar los 20 MB" }, { status: 400 })
        }

        const category = await prisma.libraryCategory.findUnique({
            where: { id: categoryId },
            select: { id: true },
        })

        if (!category) {
            return NextResponse.json({ error: "La categoría no existe" }, { status: 404 })
        }

        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
        const storagePath = `${categoryId}/${timestamp}-${safeName}`

        await uploadPdf(file, storagePath)

        const document = await prisma.libraryDocument.create({
            data: {
                title: title.trim(),
                description: typeof description === "string" && description.trim().length > 0
                    ? description.trim()
                    : null,
                fileName: file.name,
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

        return NextResponse.json({ ok: true, document }, { status: 201 })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno al subir documento"
        const status = message === "No autorizado" ? 401 : 500

        return NextResponse.json({ error: message }, { status })
    }
}
