import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function ensureAdminSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }

    return session
}
