import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

/**
 * Handles a GET request to retrieve the current user's information.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Response} - A JSON response containing the current user's information.
 */
export async function GET(request) {
    try {
        const userId = await getDataFromToken(request);

        const user = await User.findOne({ _id: userId }).select("-password"); // "-isAdmin -__v -password -_id" also works
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "User found",
            data: user,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
