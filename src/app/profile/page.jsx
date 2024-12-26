"use client";

import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/(components)/header/Header";

/**
 * ProfilePage component handles the display of the user's profile information.
 * It fetches user details upon component mount, displaying them in a structured format.
 * The component provides functionality to log the user out and navigate to the home page.
 *
 * Manages the loading state while fetching user data and redirects to the login page if
 * the user is not authenticated. Renders the user's username and max scores for different
 * regions, with options to log out or return to the home page.
 *
 * @returns {JSX.Element} The rendered profile page component.
 */
const ProfilePage = () => {
    const router = useRouter();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Logs the user out of the application and redirects to the login page.
     *
     * Sends a GET request to the logout API endpoint with the current timestamp
     * to prevent caching issues. If the request is successful, logs the user out and
     * shows a success toast. If the request fails, logs the error and shows an
     * error toast.
     */
    const logout = async () => {
        try {
            await axios.get("/api/users/logout", { withCredentials: true });
            toast.success("Logged out");
            router.push("/login");
        } catch (error) {
            console.log("Log Out failed", error.message);
            toast.error(error.message);
        }
    };

    /**
     * Fetches the user details from the server and updates the component state with the results.
     * If the user is not logged in, redirects to the login page.
     * If the request fails, logs the error and redirects to the login page.
     * Finally, sets the loading state to false.
     */
    const getUserDetails = async () => {
        try {
            const res = await axios.get("/api/users/me");
            if (res.data && res.data.data) {
                const {
                    _id,
                    username,
                    maxScoreEurope,
                    maxScoreAmericas,
                    maxScoreAsiaOceania,
                    maxScoreAfricaMe,
                } = res.data.data;
                setUserDetails({
                    id: _id,
                    username,
                    maxScoreEurope,
                    maxScoreAmericas,
                    maxScoreAsiaOceania,
                    maxScoreAfricaMe,
                });
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.log("Failed to fetch user details", error.message);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <>
            <Header className="fixed top-0 left-0 w-full z-50" />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 pt-[80px] px-4">
                <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-lg p-6">
                    <h1 className="text-3xl font-semibold mb-6 text-center text-white">
                        User Profile
                    </h1>
                    <div className="mb-6">
                        <p className="text-lg font-medium text-gray-300 text-center">
                            Username:
                        </p>
                        <h2 className="text-xl font-bold text-white text-center">
                            {userDetails?.username || "Not available"}
                        </h2>
                    </div>
                    <div className="mb-6 text-center">
                        <p className="text-lg font-medium text-gray-300 mb-4">
                            Max Scores:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <p className="text-gray-400">Europe</p>
                                <h2 className="text-xl font-bold text-white">
                                    {userDetails?.maxScoreEurope || 0}
                                </h2>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <p className="text-gray-400">Americas</p>
                                <h2 className="text-xl font-bold text-white">
                                    {userDetails?.maxScoreAmericas || 0}
                                </h2>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <p className="text-gray-400">Asia Oceania</p>
                                <h2 className="text-xl font-bold text-white">
                                    {userDetails?.maxScoreAsiaOceania || 0}
                                </h2>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-lg text-center">
                                <p className="text-gray-400">
                                    Africa & Middle East
                                </p>
                                <h2 className="text-xl font-bold text-white">
                                    {userDetails?.maxScoreAfricaMe || 0}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
                        >
                            Log Out
                        </button>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Go to Home Page
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
