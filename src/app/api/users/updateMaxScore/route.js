import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
        const { totalScore } = reqBody;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        console.log(`Current max score: ${user.maxScore}`);
        console.log(`New total score: ${totalScore}`);

        if (totalScore > user.maxScore) {
            user.maxScore = totalScore;
            await user.save();
            console.log("Score successfully updated");
        } else {
            console.log(
                "No update needed, totalScore is not greater than maxScore"
            );
        }

        return NextResponse.json(
            { message: "Max score updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json(
            { error: "Something went wrong", message: error.message },
            { status: 500 }
        );
    }
}
