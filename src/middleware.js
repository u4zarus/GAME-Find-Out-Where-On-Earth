import { NextResponse } from "next/server";

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath =
        path === "/login" || path === "/signup" || path === "/verifyemail";
    const token = request.cookies.get("token")?.value || "";

    // If the user is trying to access a public path but already has a token, redirect to home
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    // If the user is not logged in and tries to access a protected path like /game, redirect to /login
    if (!isPublicPath && !token) {
        // If accessing /game with any parameters, redirect to login
        if (path.startsWith("/game")) {
            return NextResponse.redirect(new URL("/login", request.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/profile",
        "/login",
        "/signup",
        "/game",
        "/profile/:path*",
        "/verifyemail",
    ],
};
