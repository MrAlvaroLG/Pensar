import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isAdminRoute = path.startsWith("/admin")

    const hasSessionCookie = request.cookies.getAll().some(({ name }) =>
        /^(?:__Secure-)?better-auth\.session_token(?:\.\d+)?$/.test(name)
    )

    if (isAdminRoute && !hasSessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
}