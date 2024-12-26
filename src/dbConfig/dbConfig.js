import mongoose from "mongoose";

let isConnected = false;

/**
 * Establishes a connection to MongoDB and sets up event listeners
 * for connection, disconnection, and errors.
 *
 * If MONGODB_URI is not defined, logs an error and exits with code 1.
 * If the connection is already established, logs a message and returns.
 *
 * @returns {Promise<void>}
 */
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
