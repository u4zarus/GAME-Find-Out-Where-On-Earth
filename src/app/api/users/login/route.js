import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        console.log(reqBody);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "User does not exist" },
                { status: 400 }
            );
        }
        console.log("user exists");

        // Check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 400 }
            );
        }
        console.log(user);

        // Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };
        // Create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
        });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });
        // response.cookies.set("token", token, {
        //     httpOnly: false,
        // });
        response.cookies.set("token", token, {
            httpOnly: true, // Prevent JavaScript access
            secure: process.env.NODE_ENV === "production", // Ensure it's only sent over HTTPS in production
            sameSite: "lax", // Prevent cross-origin requests unless they are safe (GET requests, etc.)
            path: "/", // Make it accessible across the app
        });
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
