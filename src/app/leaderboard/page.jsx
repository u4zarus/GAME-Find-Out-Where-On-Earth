"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/(components)/header/Header";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * LeaderBoard component displays the top scores for different regions.
 * It fetches and displays the leaderboard data for four regions:
 * Europe, Americas, Asia Oceania, and Africa Middle East. It also displays
 * the current user's scores, highlighting them on the leaderboard if present.
 *
 * Uses axios to fetch leaderboard and current user data, and updates
 * state accordingly. Renders tables for each region's leaderboard.
 *
 * @returns {JSX.Element} The rendered leaderboard component.
 */
const LeaderBoard = () => {
  const [europe, setEurope] = useState([]);
  const [americas, setAmericas] = useState([]);
  const [asiaOceania, setAsiaOceania] = useState([]);
  const [africaMe, setAfricaMe] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { t } = useLanguage();

  /**
   * Fetches the leaderboard data for various regions and updates the state.
   *
   * Sends a GET request to the leaderboard API endpoint with the current timestamp
   * to prevent caching issues. The response includes the top scores for Europe,
   * Americas, Asia Oceania, and Africa Middle East regions. The leaderboard data
   * is set in the component's state upon successful fetch.
   *
   * Logs the fetched data to the console for debugging purposes.
   * Handles and logs any errors that occur during the fetch operation.
   */
  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `/api/users/leaderboard?timestamp=${new Date().getTime()}`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      console.log("Leaderboard Fetched:", response.data);
      setEurope(response.data.europe);
      setAmericas(response.data.americas);
      setAsiaOceania(response.data.asiaOceania);
      setAfricaMe(response.data.africaMe);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches the current user's data and updates the component's state.
   *
   * Sends a GET request to the "me" API endpoint with the current timestamp
   * to prevent caching issues. The response includes the current user's data.
   * The current user's data is set in the component's state upon successful fetch.
   *
   * Logs the fetched data to the console for debugging purposes.
   * Handles and logs any errors that occur during the fetch operation.
   */
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

  /**
   * Renders a leaderboard table displaying user rankings, usernames, and max scores
   * for a specific region. Highlights the current user's row if present.
   *
   * @param {Array} data - An array of user objects to display in the table, each containing
   *                       properties such as _id, username, and max scores for different regions.
   * @param {string} title - The title of the table, indicating the region (e.g., "European Cities").
   *
   * @returns {JSX.Element} A JSX element representing the leaderboard table.
   */
  const renderTable = (data, title) => (
    <div className="w-full mb-6 bg-gray-800 border-2 border-secondary rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-xl font-semibold text-center py-4 text-primary">
        {/* {title} */}
        {t(`home.gameModes.${title}`)}
      </h2>
      <div className="max-h-[500px] overflow-y-auto no-scrollbar">
        <table className="table-fixed w-full text-left border-collapse">
          <thead className="bg-gray-900 sticky top-0">
            <tr>
              <th className="px-3 py-3 text-white font-semibold w-1/6 border-r border-gray-700">
                {t("leaderboard.columns.rank")}
              </th>
              <th className="px-3 py-3 text-white font-semibold w-3/6 truncate border-r border-gray-700">
                {t("leaderboard.columns.username")}
              </th>
              <th className="px-3 py-3 text-white font-semibold w-2/6">
                {t("leaderboard.columns.maxScore")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => {
              const isCurrentUser =
                currentUser && currentUser.username === user.username;
              return (
                <tr
                  key={user._id}
                  className={`${
                    isCurrentUser
                      ? "bg-primary text-white"
                      : index % 2 === 0
                      ? "bg-gray-800"
                      : "bg-gray-700"
                  } hover:bg-gray-600 transition-colors duration-150`}
                >
                  <td className="border border-gray-700 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 truncate">
                    {user.username}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 text-center">
                    {title === "European Cities"
                      ? user.maxScoreEurope
                      : title === "American Cities"
                      ? user.maxScoreAmericas
                      : title === "Asian and Oceanian Cities"
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
        <div className="mt-3 p-3 bg-gray-900 text-center text-primary border-t border-gray-700">
          <p className="font-medium">
            {t("leaderboard.yourScore")}:{" "}
            {title === "europe"
              ? currentUser.maxScoreEurope
              : title === "america"
              ? currentUser.maxScoreAmericas
              : title === "asia"
              ? currentUser.maxScoreAsiaOceania
              : currentUser.maxScoreAfricaMe}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-dark">
      <Header />
      <main className="flex flex-col items-center justify-start p-6 flex-1 text-white w-full">
        <h1 className="text-4xl font-bold text-center mb-6">
          {t("leaderboard.title")}
        </h1>
        <div className="flex flex-col items-center w-full max-w-5xl gap-6">
          {renderTable(europe, "europe")}
          {renderTable(americas, "america")}
          {renderTable(asiaOceania, "asia")}
          {renderTable(africaMe, "africa")}
        </div>
      </main>
    </div>
  );
};

export default LeaderBoard;
