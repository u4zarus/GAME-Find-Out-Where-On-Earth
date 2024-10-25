"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
            const response = await axios.post("/api/users/login", user);
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
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Log In"}</h1>
            <hr />

            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            />

            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="Password"
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            />

            <button
                onClick={onLogin}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                Log In
            </button>

            <Link href="/signup">Don&#39;t have an account?</Link>
        </div>
    );
};

export default LoginPage;
