"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/(components)/header/Header";

const LeaderBoard = () => {
    const [cities, setCities] = useState([]);
    const [landmarks, setLandmarks] = useState([]);
    const [mixed, setMixed] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get("/api/users/leaderboard");
                setCities(response.data.usersCities);
                setLandmarks(response.data.usersLandmarks);
                setMixed(response.data.usersMixed);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLeaderboard();
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const renderTable = (data, title) => (
        <div className="w-full max-w-xs mx-2">
            <h2 className="text-2xl font-semibold text-center my-3">{title}</h2>
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
                        {data.map((user, index) => (
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
                                    {title === "Cities"
                                        ? user.maxScoreCities
                                        : title === "Landmarks"
                                        ? user.maxScoreLandmarks
                                        : user.maxScore}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col justify-center items-center p-4 bg-gray-900 min-h-screen text-gray-200">
                <h1 className="text-4xl font-bold text-center mb-5 text-white">
                    Leaderboard
                </h1>
                <div className="flex justify-around w-full max-w-5xl">
                    {renderTable(cities, "Cities")}
                    {renderTable(landmarks, "Landmarks")}
                    {renderTable(mixed, "Mixed")}
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
