import { headers } from "next/headers"
import { auth } from "@/lib/auth"

async function getSessionOrThrowUnauthorized() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("No autorizado")
    }

    return session
}

export async function ensureAdminSession() {
    const session = await getSessionOrThrowUnauthorized()

    if (session.user.role !== "ADMIN") {
        throw new Error("No autorizado")
    }

    return session
}

export async function ensureLibrarySession() {
    const session = await getSessionOrThrowUnauthorized()

    if (session.user.role !== "ADMIN" && session.user.role !== "PUBLISHER") {
        throw new Error("No autorizado")
    }

    return session
}
