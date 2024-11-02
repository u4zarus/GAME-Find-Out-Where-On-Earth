"use client";

import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/(components)/header/Header";

const ProfilePage = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = useState({
        id: "Nothing",
        username: "",
        maxScore: 0,
    });

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
        try {
            const res = await axios.get("/api/users/me");
            const { _id, username, maxScore } = res.data.data;
            setUserDetails({ id: _id, username, maxScore });
        } catch (error) {
            console.log("Failed to fetch user details", error.message);
            toast.error("Failed to load user details");
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <>
            <Header className="fixed top-0 left-0 w-full z-50" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 pt-[80px]">
                {/* Adjust the pt-[80px] value based on your header's height */}
                <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-semibold mb-4 text-center">
                        User Profile
                    </h1>
                    <div className="text-center mb-6">
                        <p className="text-lg font-medium">Username:</p>
                        <h2 className="text-xl font-bold mb-2">
                            {userDetails.username || "Loading..."}
                        </h2>
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-lg font-medium">User ID:</p>
                        <h2 className="text-gray-400 mb-2">
                            {userDetails.id === "Nothing" ? (
                                "Not Available"
                            ) : (
                                <Link
                                    href={`/profile/${userDetails.id}`}
                                    className="text-blue-400 hover:underline"
                                >
                                    {userDetails.id}
                                </Link>
                            )}
                        </h2>
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-lg font-medium">Max Score:</p>
                        <h2 className="text-xl font-bold">
                            {userDetails.maxScore}
                        </h2>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                        >
                            Log Out
                        </button>
                        <button
                            onClick={getUserDetails}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
