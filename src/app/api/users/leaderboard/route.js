import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        const usersCities = await User.find()
            .sort({ maxScoreCities: -1 })
            .limit(20);
        const usersLandmarks = await User.find()
            .sort({ maxScoreLandmarks: -1 })
            .limit(20);
        const usersMixed = await User.find().sort({ maxScore: -1 }).limit(20); // Limit to top 20 users

        return NextResponse.json({
            usersCities,
            usersLandmarks,
            usersMixed,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
