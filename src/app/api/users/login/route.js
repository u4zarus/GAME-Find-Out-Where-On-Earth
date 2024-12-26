import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

/**
 * Handles a POST request to log in a user.
 *
 * @param {Request} request - The incoming request object containing cookies and JSON body.
 * @returns {Response} - A JSON response indicating the result of the operation.
 *
 * Possible response statuses:
 * - 200: Login successful.
 * - 400: User does not exist or invalid password.
 * - 500: Internal Server Error, if an unexpected error occurs.
 */
export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }

        const tokenData = {
            id: user._id,
            username: user.username,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET);

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
