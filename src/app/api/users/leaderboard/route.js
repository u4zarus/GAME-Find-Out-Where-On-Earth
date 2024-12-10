import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
    try {
        const europe = await User.find()
            .sort({ maxScoreEurope: -1 })
            .limit(20)
            .lean();
        const americas = await User.find()
            .sort({ maxScoreAmericas: -1 })
            .limit(20)
            .lean();
        const asiaOceania = await User.find()
            .sort({ maxScoreAsiaOceania: -1 })
            .limit(20)
            .lean();
        const africaMe = await User.find()
            .sort({ maxScoreAfricaMe: -1 })
            .limit(20)
            .lean();

        const response = NextResponse.json({
            europe,
            americas,
            asiaOceania,
            africaMe,
        });

        response.headers.set("Cache-Control", "no-cache, no-store, max-age=0");
        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
