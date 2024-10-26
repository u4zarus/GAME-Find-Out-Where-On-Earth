"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";

const LeaderBoard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("/api/users/leaderboard");
                setLeaderboard(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLeaderboard();

        // Disable scrolling on the body while the leaderboard component is mounted
        document.body.style.overflow = "hidden";

        // Cleanup: Re-enable body scrolling when the component is unmounted
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col justify-center items-center p-4 bg-gray-900 min-h-screen text-gray-200">
                <h1 className="text-4xl font-bold text-center mb-5 text-white">
                    Leaderboard
                </h1>

                <div className="w-full max-w-4xl">
                    {/* Scrollable table wrapper */}
                    <div className="overflow-x-auto">
                        <div className="max-h-[500px] overflow-y-auto">
                            <table className="table-auto w-full text-left">
                                <thead className="bg-gray-800 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-gray-300 font-semibold">
                                            Rank
                                        </th>
                                        <th className="px-6 py-3 text-gray-300 font-semibold">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-gray-300 font-semibold">
                                            Max Score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard
                                        .filter((user) => user)
                                        .map((user, index) => (
                                            <tr
                                                key={user._id}
                                                className={`${
                                                    index % 2 === 0
                                                        ? "bg-gray-800"
                                                        : "bg-gray-700"
                                                } hover:bg-gray-600 transition-colors duration-150`}
                                            >
                                                <td className="border border-gray-600 px-6 py-3">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-600 px-6 py-3">
                                                    {user.username}
                                                </td>
                                                <td className="border border-gray-600 px-6 py-3">
                                                    {user.maxScore}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
