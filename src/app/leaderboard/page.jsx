"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/(components)/header/Header";

const LeaderBoard = () => {
    const [europe, setEurope] = useState([]);
    const [americas, setAmericas] = useState([]);
    const [asiaOceania, setAsiaOceania] = useState([]);
    const [africaMe, setAfricaMe] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchLeaderboard = async () => {
        try {
            const response = await axios.get("/api/users/leaderboard", {
                withCredentials: true,
                headers: {
                    "Cache-Control": "no-cache",
                },
            });
            console.log("Leaderboard Fetched:", response.data);
            // setCities(response.data.usersCities);
            // setLandmarks(response.data.usersLandmarks);
            // setMixed(response.data.usersMixed);
            setEurope(response.data.europe);
            setAmericas(response.data.americas);
            setAsiaOceania(response.data.asiaOceania);
            setAfricaMe(response.data.africaMe);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get("/api/users/me", {
                withCredentials: true,
                headers: {
                    "Cache-Control": "no-cache",
                },
            });
            setCurrentUser(response.data.data);
            console.log("Current User Fetched:", response.data);
        } catch (error) {
            console.error("Failed to fetch current user:", error);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            console.log("Updated Current User:", currentUser);
        }
    }, [currentUser]);

    const renderTable = (data, title) => (
        <div className="w-full mb-4">
            <h2 className="text-2xl font-semibold text-center my-3">{title}</h2>
            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                <table className="table-fixed w-full text-left border-collapse">
                    <thead className="bg-gray-800 sticky top-0">
                        <tr>
                            <th className="px-2 py-3 text-gray-300 font-semibold w-1/6">
                                Rank
                            </th>
                            <th className="px-2 py-3 text-gray-300 font-semibold w-3/6 truncate">
                                Username
                            </th>
                            <th className="px-2 py-3 text-gray-300 font-semibold w-2/6">
                                Max Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, index) => {
                            const isCurrentUser =
                                currentUser &&
                                currentUser.username === user.username;
                            return (
                                <tr
                                    key={user._id}
                                    className={`${
                                        isCurrentUser
                                            ? "bg-blue-500 text-white"
                                            : index % 2 === 0
                                            ? "bg-gray-800"
                                            : "bg-gray-700"
                                    } hover:bg-gray-600 transition-colors duration-150`}
                                >
                                    <td className="border border-gray-600 px-2 py-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-600 px-2 py-3 truncate">
                                        {user.username}
                                    </td>
                                    <td className="border border-gray-600 px-2 py-3 text-center">
                                        {title === "European Cities"
                                            ? user.maxScoreEurope
                                            : title === "American Cities"
                                            ? user.maxScoreAmericas
                                            : title ===
                                              "Asian and Oceanian Cities"
                                            ? user.maxScoreAsiaOceania
                                            : user.maxScoreAfricaMe}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {currentUser && (
                <div className="mt-4 text-center text-gray-400">
                    <p>
                        Your Score:{" "}
                        {title === "European Cities"
                            ? currentUser.maxScoreEurope
                            : title === "American Cities"
                            ? currentUser.maxScoreAmericas
                            : title === "Asian and Oceanian Cities"
                            ? currentUser.maxScoreAsiaOceania
                            : currentUser.maxScoreAfricaMe}
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-col justify-center items-center p-4 bg-gray-900 min-h-screen text-gray-200 overflow-y-auto">
                <h1 className="text-4xl font-bold text-center mb-5 text-white">
                    Leaderboard
                </h1>
                <div className="flex flex-col items-center w-full max-w-5xl gap-6">
                    <div className="w-full max-w-2xl">
                        {renderTable(europe, "European Cities")}
                    </div>
                    <div className="w-full max-w-2xl">
                        {renderTable(americas, "American Cities")}
                    </div>
                    <div className="w-full max-w-2xl">
                        {renderTable(asiaOceania, "Asian and Oceanian Cities")}
                    </div>
                    <div className="w-full max-w-2xl">
                        {renderTable(
                            africaMe,
                            "African and Middle Eastern Cities"
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderBoard;
