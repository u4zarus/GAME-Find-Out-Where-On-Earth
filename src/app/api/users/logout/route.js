import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logged out",
            success: true,
        });

        console.log("clearing token");

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        console.log("token cleared");

        setTimeout(() => {
            response.cookies.set("token", "", {
                httpOnly: true,
                expires: new Date(0),
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });
        }, 100);

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
