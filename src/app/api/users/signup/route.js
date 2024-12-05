import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request) {
    try {
        const reqBody = await request.json();
        const { username, password } = reqBody;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        console.log("Incoming request body:", reqBody);

        // Check if user exists
        const user = await User.findOne({ username });

        if (user) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        console.log("New user saved:", savedUser);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in /api/users/signup:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
