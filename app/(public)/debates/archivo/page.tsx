import { getAllPastDebatesForArchive } from "@/lib/debates"
import { ArchivoClient } from "./archivo-client"

export default async function ArchivoPage() {
    const debates = await getAllPastDebatesForArchive()

    return <ArchivoClient debates={debates} />
}
