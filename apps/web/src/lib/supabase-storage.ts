import "server-only"
import { createClient } from "@supabase/supabase-js"

const LIBRARY_BUCKET = "library-pdfs"
const DEBATE_DOCS_BUCKET = "debate-docs"

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
        .from(LIBRARY_BUCKET)
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
        .from(LIBRARY_BUCKET)
        .remove([path])

    if (error) throw new Error(`Error al eliminar PDF: ${error.message}`)
}

export function getPublicUrl(path: string) {
    const supabase = getSupabaseAdmin()
    const { data } = supabase.storage
        .from(LIBRARY_BUCKET)
        .getPublicUrl(path)

    return data.publicUrl
}

export async function uploadDebateDoc(file: File, path: string) {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
        .from(DEBATE_DOCS_BUCKET)
        .upload(path, file, {
            contentType: "application/pdf",
            upsert: false,
        })

    if (error) throw new Error(`Error al subir documento: ${error.message}`)
    return data.path
}

export async function deleteDebateDoc(path: string) {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage
        .from(DEBATE_DOCS_BUCKET)
        .remove([path])

    if (error) throw new Error(`Error al eliminar documento: ${error.message}`)
}

export function getDebateDocPublicUrl(path: string) {
    const supabase = getSupabaseAdmin()
    const { data } = supabase.storage
        .from(DEBATE_DOCS_BUCKET)
        .getPublicUrl(path)

    return data.publicUrl
}
