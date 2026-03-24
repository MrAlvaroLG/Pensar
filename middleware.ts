import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware para proteger rutas admin.
 *
 * Nota: aquí no validamos rol en profundidad (middleware corre en Edge y no podemos
 * consultar la DB), pero sí verificamos que existe sesión de better-auth.
 * La comprobación de `role` se mantiene en layouts server-side.
 */
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith("/admin")

    if (!isAdminRoute) return NextResponse.next()

    const hasSessionCookie = request.cookies
        .getAll()
        .some(({ name }) => /^(?:__Secure-)?better-auth\.session_token(?:\.\d+)?$/.test(name))

    if (!hasSessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*"],
}

