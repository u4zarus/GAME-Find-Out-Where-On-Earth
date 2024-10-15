"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignupPage = () => {
    const router = useRouter();

    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
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
        if (
            user.email.length > 0 &&
            user.password.length > 0 &&
            user.username.length > 0
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Sign Up"}</h1>
            <hr />

            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
            />

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
                onClick={onSignup}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                {buttonDisabled ? "Please fill in all fields" : "Sign Up"}
            </button>

            <Link href="/login">Already have an account?</Link>
        </div>
    );
};

export default SignupPage;
