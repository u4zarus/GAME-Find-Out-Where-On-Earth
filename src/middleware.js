import { NextResponse } from "next/server";

/**
 * Redirects the user to the login page if they are not logged in and not on a public path.
 * Redirects the user to the home page if they are logged in and on a public path.
 *
 * @param {import("next/server").NextRequest} request - The request object.
 * @returns {import("next/server").NextResponse} - The response object to redirect the user.
 */
export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path === "/signup";
    const token = request.cookies.get("token")?.value || "";

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
