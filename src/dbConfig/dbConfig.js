import mongoose from "mongoose";

export async function connect() {
    try {
        if (process.env.MONGODB_URI === undefined) {
            console.error("MONGODB_URI is not defined");
            process.exit(1);
        }
        mongoose.connect(process.env.MONGODB_URI);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        connection.on("error", (error) => {
            console.error("Error connecting to MongoDB", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("Something went wrong", error);
        process.exit(1);
    }
}
