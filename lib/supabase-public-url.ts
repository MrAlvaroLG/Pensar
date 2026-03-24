/**
 * URLs públicas de Storage: solo hace falta la URL del proyecto (no anon key).
 * @see https://supabase.com/docs/guides/storage/serving/downloads#public-buckets
 */
const LIBRARY_BUCKET = "library-pdfs"
const DEBATE_DOCS_BUCKET = "debate-docs"

function buildPublicStorageUrl(bucket: string, objectPath: string): string {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "")
    if (!base) {
        throw new Error(
            "Falta NEXT_PUBLIC_SUPABASE_URL (necesaria para enlaces públicos de Storage)"
        )
    }
    const safePath = objectPath.split("/").filter(Boolean).map(encodeURIComponent).join("/")
    return `${base}/storage/v1/object/public/${bucket}/${safePath}`
}

export function getPublicUrl(path: string) {
    return buildPublicStorageUrl(LIBRARY_BUCKET, path)
}

export function getDebateDocPublicUrl(path: string) {
    return buildPublicStorageUrl(DEBATE_DOCS_BUCKET, path)
}
