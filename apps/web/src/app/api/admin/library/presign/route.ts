import { NextResponse } from "next/server"
import prisma from "@pensar/db"
import { ensureAdminSession } from "@/lib/admin-auth"
import { createSignedUploadUrl } from "@/lib/supabase-storage"

export async function POST(request: Request) {
    try {
        await ensureAdminSession()

        const body = await request.json() as { categoryId?: string; fileName?: string }
        const { categoryId, fileName } = body

        if (typeof categoryId !== "string" || !categoryId) {
            return NextResponse.json({ error: "categoryId requerido" }, { status: 400 })
        }
        if (typeof fileName !== "string" || !fileName) {
            return NextResponse.json({ error: "fileName requerido" }, { status: 400 })
        }

        const category = await prisma.libraryCategory.findUnique({
            where: { id: categoryId },
            select: { id: true },
        })
        if (!category) {
            return NextResponse.json({ error: "La categoría no existe" }, { status: 404 })
        }

        const timestamp = Date.now()
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")
        const storagePath = `${categoryId}/${timestamp}-${safeName}`

        const { signedUrl } = await createSignedUploadUrl(storagePath)

        return NextResponse.json({ signedUrl, storagePath })
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error interno"
        const status = message === "No autorizado" ? 401 : 500
        return NextResponse.json({ error: message }, { status })
    }
}
