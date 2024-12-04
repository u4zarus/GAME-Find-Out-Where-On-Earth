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

        return NextResponse.json(
            {
                usersCities,
                usersLandmarks,
                usersMixed,
            },
            {
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate, proxy-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                    "Surrogate-Control": "no-store",
                },
            }
        );
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
