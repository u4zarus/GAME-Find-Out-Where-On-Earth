"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/(components)/header/Header";

/**
 * Renders the sign up page for the application.
 *
 * This component provides a user interface for users to sign up by entering a
 * username and password. It manages the state of user credentials, loading
 * status, and button disabled state. The component also handles sign up requests
 * to the server and provides feedback to users via alerts and toasts based on the
 * success or failure of the sign up attempt.
 *
 * @returns {JSX.Element} The rendered sign up page component.
 */
const SignupPage = () => {
    const router = useRouter();

    const [user, setUser] = useState({
        password: "",
        username: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    /**
     * Handles a sign up request to the server.
     *
     * Sends a POST request to the sign up API endpoint with the current user
     * credentials and withCredentials set to true. If the request is successful,
     * redirects to the login page. If the request fails, logs the error and
     * shows an error toast. Finally, sets the loading state to false.
     */
    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user, {
                withCredentials: true,
            });
            console.log("Sign Up successful", response.data);
            router.push("/login");
        } catch (error) {
            console.log("Sign Up failed", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(user);

        if (user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <>
            <Header className="fixed top-0 left-0 w-full z-50" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 pt-[80px]">
                <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-center">
                        {loading ? "Processing..." : "Sign Up"}
                    </h1>
                    <hr className="border-gray-600 mb-4" />

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
                        onClick={onSignup}
                        disabled={buttonDisabled}
                        className={`w-full p-2 rounded-lg mb-4 focus:outline-none ${
                            buttonDisabled
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    <Link
                        href="/login"
                        className="text-blue-400 hover:underline text-center block mt-4"
                    >
                        Already have an account?
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SignupPage;
