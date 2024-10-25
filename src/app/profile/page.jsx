"use client";

import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProfilePage = () => {
    const router = useRouter();
    const [data, setData] = useState("Nothing");

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logged out");
            router.push("/login");
        } catch (error) {
            console.log("Log Out failed", error.message);
            toast.error(error.message);
        }
    };

    const getUserDetails = async () => {
        const res = await axios.get("/api/users/me");
        console.log(res.data);
        setData(res.data.data._id);
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-2">
            <Link href="/" className="text-blue-300">
                Go to Home
            </Link>
            Profile
            <h2 className="p-1 rounded bg-green-500">
                {data === "Nothing" ? (
                    "Nothing"
                ) : (
                    <Link href={`/profile/${data}`}>{data}</Link>
                )}
            </h2>
            <hr />
            <button
                onClick={logout}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                Log Out
            </button>
            <button
                onClick={getUserDetails}
                className="p-2 border bg-slate-800 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            >
                Get User Details
            </button>
        </div>
    );
};

export default ProfilePage;
