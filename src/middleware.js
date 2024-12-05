import { NextResponse } from "next/server";

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path === "/signup";
    const isLogoutPath = path === "/logout";
    const token = request.cookies.get("token")?.value || "";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !token && !isLogoutPath) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/profile", "/login", "/signup", "/game", "/profile/:path*"],
};
