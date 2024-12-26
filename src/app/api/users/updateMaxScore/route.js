import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";

connect();

/**
 * Handles a POST request to update the user's max score for a specific game mode.
 *
 * Verifies the user's authentication token and retrieves the user information.
 * If the user exists and the provided totalScore is greater than the current max score
 * for the specified mode, updates the user's max score. Supports four game modes:
 * - "0": Europe
 * - "1": Americas
 * - "2": Asia Oceania
 * - "3": Africa Middle East
 *
 * @param {Request} request - The incoming request object containing cookies and JSON body.
 * @returns {Response} - A JSON response indicating the result of the operation.
 *
 * Possible response statuses:
 * - 200: Max score updated successfully.
 * - 401: Unauthorized, if the token is missing or invalid.
 * - 404: User not found.
 * - 500: Internal Server Error, if an unexpected error occurs.
 */
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
        if (mode === "0" && totalScore > user.maxScoreEurope)
            user.maxScoreEurope = totalScore;
        else if (mode === "1" && totalScore > user.maxScoreAmericas)
            user.maxScoreAmericas = totalScore;
        else if (mode === "2" && totalScore > user.maxScoreAsiaOceania)
            user.maxScoreAsiaOceania = totalScore;
        else if (mode === "3" && totalScore > user.maxScoreAfricaMe)
            user.maxScoreAfricaMe = totalScore;

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
