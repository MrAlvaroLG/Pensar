import "server-only"
import { createClient } from "@supabase/supabase-js"

const BUCKET = "library-pdfs"

function getSupabaseAdmin() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
        throw new Error("Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
    }

    return createClient(url, key, {
        auth: { persistSession: false },
    })
}

export async function uploadPdf(file: File, path: string) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            contentType: "application/pdf",
            upsert: false,
        })

    if (error) throw new Error(`Error al subir PDF: ${error.message}`)
    return data.path
}

export async function deletePdf(path: string) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([path])

    if (error) throw new Error(`Error al eliminar PDF: ${error.message}`)
}

export function getPublicUrl(path: string) {
    const supabase = getSupabaseAdmin()
    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path)

    return data.publicUrl
}
