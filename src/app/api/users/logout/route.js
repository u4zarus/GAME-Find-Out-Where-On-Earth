import { NextResponse } from "next/server";

/**
 * Handles a GET request to log out the user.
 *
 * @returns {Response} - A JSON response indicating the result of the operation.
 *
 * Possible response statuses:
 * - 200: User logged out successfully.
 * - 500: Internal Server Error, if an unexpected error occurs.
 */
export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logged out",
            success: true,
        });

        console.log("clearing token");

        response.cookies.delete("token", {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        console.log("token cleared");

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
