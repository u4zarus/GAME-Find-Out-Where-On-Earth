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
            <div className="flex flex-col items-center justify-center min-h-screen text-white pt-[80px] px-4 bg-dark">
                <div className="w-full max-w-lg shadow-lg rounded-2xl p-8 border-2 border-secondary">
                    <h1 className="text-2xl font-semibold mb-6 text-center text-primary">
                        User Profile
                    </h1>
                    <div className="mb-6 p-4 rounded-lg border border-gray-700">
                        <p className="text-md font-medium text-gray-300 text-center mb-2">
                            Username:
                        </p>
                        <h2 className="text-xl font-bold text-primary text-center">
                            {userDetails?.username || "Not available"}
                        </h2>
                    </div>
                    <div className="mb-6 text-center">
                        <p className="text-lg font-medium text-gray-300 mb-4">
                            Max Scores:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg text-center border border-gray-700">
                                <p className="text-gray-400 mb-2">Europe</p>
                                <h2 className="text-xl font-bold text-primary">
                                    {userDetails?.maxScoreEurope || 0}
                                </h2>
                            </div>
                            <div className="p-4 rounded-lg text-center border border-gray-700">
                                <p className="text-gray-400 mb-2">Americas</p>
                                <h2 className="text-xl font-bold text-primary">
                                    {userDetails?.maxScoreAmericas || 0}
                                </h2>
                            </div>
                            <div className="p-4 rounded-lg text-center border border-gray-700">
                                <p className="text-gray-400 mb-2">
                                    Asia Oceania
                                </p>
                                <h2 className="text-xl font-bold text-primary">
                                    {userDetails?.maxScoreAsiaOceania || 0}
                                </h2>
                            </div>
                            <div className="p-4 rounded-lg text-center border border-gray-700">
                                <p className="text-gray-400 mb-2">
                                    Africa & Middle East
                                </p>
                                <h2 className="text-xl font-bold text-primary">
                                    {userDetails?.maxScoreAfricaMe || 0}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={logout}
                            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none transition-colors border-2 border-red-600 hover:border-red-700"
                        >
                            Log Out
                        </button>
                        <Link
                            href="/"
                            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none transition-colors border-2 border-primary hover:border-primary-dark text-center"
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
