import mongoose from "mongoose";

// Track the connection status
let isConnected = false;

export async function connect() {
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined");
            process.exit(1);
        }

        // Establish a new MongoDB connection if not already connected
        await mongoose.connect(process.env.MONGODB_URI);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });

        connection.on("error", (error) => {
            console.error("Error connecting to MongoDB", error);
            process.exit(1);
        });

        connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
            isConnected = false; // Reset connection status when disconnected
        });

        // Set isConnected to true once the connection is successfully established
        isConnected = connection.readyState === 1;
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        process.exit(1);
    }
}
