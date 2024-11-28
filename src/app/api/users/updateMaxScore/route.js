import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.id;

        const reqBody = await request.json();
        const { totalScore, mode } = reqBody;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update scores based on game mode
        if (mode === "0" && totalScore > user.maxScoreCities)
            user.maxScoreCities = totalScore;
        else if (mode === "1" && totalScore > user.maxScoreLandmarks)
            user.maxScoreLandmarks = totalScore;
        else if (mode === "2" && totalScore > user.maxScore)
            user.maxScore = totalScore;

        await user.save();
        return NextResponse.json(
            { message: "Max score updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong", message: error.message },
            { status: 500 }
        );
    }
}
