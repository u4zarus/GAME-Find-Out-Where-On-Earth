"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/(components)/header/Header";

/**
 * Renders the login page for the application.
 *
 * This component provides a user interface for users to log in by entering a
 * username and password. It manages the state of user credentials, loading
 * status, and button disabled state. The component also handles login
 * requests to the server and provides feedback to users via alerts and
 * toasts based on the success or failure of the login attempt.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    /**
     * Handles a login request to the server.
     *
     * @param {object} user - The user credentials object containing a username and password.
     *
     * @returns {Promise<void>} - Resolves when the login request is completed, or rejects if the login fails.
     *
     * Possible response statuses:
     * - 200: Login successful, redirects to the home page.
     * - 400: Invalid username or password.
     * - 500: Internal Server Error, if an unexpected error occurs.
     */
    const onLogin = async () => {
        try {
            setLoading(true);
            setAlertMessage(""); // Reset alert message on login attempt
            const response = await axios.post("/api/users/login", user, {
                withCredentials: true,
            });
            console.log("Log In successful", response.data);
            toast.success("Log In successful");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.log(
                "Log In failed",
                error.response?.data?.message || error.message
            );
            setAlertMessage(
                error.response?.data?.message || "Invalid username or password"
            );
            toast.error("Log In failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.username.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 py-10">
                <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        {loading ? "Processing..." : "Log In"}
                    </h1>
                    <hr className="border-gray-600 mb-4" />

                    {alertMessage && (
                        <div className="mb-4 p-2 bg-red-600 text-white text-center rounded">
                            {alertMessage}
                        </div>
                    )}

                    <label htmlFor="username" className="block mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                        }
                        placeholder="Username"
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                    />

                    <label htmlFor="password" className="block mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                        }
                        placeholder="Password"
                        className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
                    />

                    <button
                        onClick={onLogin}
                        disabled={buttonDisabled}
                        className={`w-full p-2 rounded-lg mb-4 focus:outline-none ${
                            buttonDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                    >
                        {loading ? "Logging In..." : "Log In"}
                    </button>

                    <Link
                        href="/signup"
                        className="text-blue-400 hover:underline text-center block mt-4"
                    >
                        Don&#39;t have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
