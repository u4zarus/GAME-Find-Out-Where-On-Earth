"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/(components)/header/Header";

const LoginPage = () => {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user, {
                withCredentials: true,
            });
            console.log("Log In successful", response.data);
            toast.success("Log In successful");
            router.push("/profile");
        } catch (error) {
            console.log("Log In failed", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
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

                    <label htmlFor="email" className="block mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                        placeholder="Email"
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
