import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isDashboardRoute = path.startsWith("/dashboard")

    const hasSessionCookie = request.cookies.getAll().some(({ name }) =>
        /^(?:__Secure-)?better-auth\.session_token(?:\.\d+)?$/.test(name)
    )

    if (isDashboardRoute && !hasSessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
    ],
}