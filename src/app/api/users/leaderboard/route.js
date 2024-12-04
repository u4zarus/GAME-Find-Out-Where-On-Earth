import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        const usersCities = await User.find()
            .sort({ maxScoreCities: -1 })
            .limit(20)
            .lean();
        const usersLandmarks = await User.find()
            .sort({ maxScoreLandmarks: -1 })
            .limit(20)
            .lean();
        const usersMixed = await User.find()
            .sort({ maxScore: -1 })
            .limit(20)
            .lean();

        const response = NextResponse.json({
            usersCities,
            usersLandmarks,
            usersMixed,
        });

        response.headers.set("Cache-Control", "no-cache, no-store, max-age=0");
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
