import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isDashboardRoute = path.startsWith("/dashboard");
    const sessionCookie = request.cookies.get("better-auth.session_token");
    if ((isDashboardRoute) && !sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*", 
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};