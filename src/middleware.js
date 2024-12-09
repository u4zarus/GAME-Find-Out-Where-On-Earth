import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path === "/signup";
    const token = request.cookies.get("token")?.value || "";

    if (token) {
        try {
            jwt.verify(token, process.env.TOKEN_SECRET); // Verify token validity
        } catch (error) {
            // Token is invalid or expired, redirect to login
            const response = NextResponse.redirect(
                new URL("/login", request.nextUrl)
            );
            response.cookies.set("token", "", {
                // Clear the invalid token
                httpOnly: true,
                expires: new Date(0),
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
            return response;
        }
    }

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/profile", "/login", "/signup", "/game", "/profile/:path*"],
};
