import { redirect } from "next/navigation"

interface DocRedirectPageProps {
    params: Promise<{ docId: string }>
}

export default async function DocRedirectPage({ params }: DocRedirectPageProps) {
    const { docId } = await params
    redirect(`/library/${docId}`)
}
