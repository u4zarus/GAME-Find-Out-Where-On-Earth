"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Axios } from "axios";
import { useState } from "react";

const LoginPage = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const onLogin = async () => {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Log In</h1>
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
