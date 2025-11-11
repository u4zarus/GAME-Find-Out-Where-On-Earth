"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";

/**
 * Renders the login page for the application.
 *
 * This component provides a user interface for users to log in by entering a
 * username and password. It manages the state of user credentials, loading
 * status, and button disabled state. The component also handles login
 * requests to the server and provides feedback to users via alerts and
 * toasts based on the success or failure of the login attempt.
 *
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  /**
   * Handles a login request to the server.
   *
   * @param {object} user - The user credentials object containing a username and password.
   *
   * @returns {Promise<void>} - Resolves when the login request is completed, or rejects if the login fails.
   *
   * Possible response statuses:
   * - 200: Login successful, redirects to the home page.
   * - 400: Invalid username or password.
   * - 500: Internal Server Error, if an unexpected error occurs.
   */
  const onLogin = async () => {
    try {
      setLoading(true);
      setAlertMessage(""); // Reset alert message on login attempt
      const response = await axios.post("/api/users/login", user, {
        withCredentials: true,
      });
      console.log("Log In successful", response.data);
      toast.success("Log In successful");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log(
        "Log In failed",
        error.response?.data?.message || error.message
      );
      setAlertMessage(
        error.response?.data?.message || "Špaté jmeno nebo heslo"
      );
      toast.error("Log In failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-dark text-white">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 p-6 mt-16">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-secondary">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo_.png"
              alt="Logo"
              width={100}
              height={60}
              className="cursor-pointer"
            />
          </div>

          <h1 className="text-2xl font-semibold text-center mb-6 text-primary">
            {loading ? "Zpracovávám..." : "Přihlas se do svého účtu"}
          </h1>
          <hr className="border-gray-700 mb-6" />

          {alertMessage && (
            <div className="mb-4 p-3 bg-red-600 text-white text-center rounded-lg border border-red-400">
              {alertMessage}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 font-medium text-gray-300"
              >
                Uživatelské jméno
              </label>
              <input
                type="text"
                id="username"
                value={user.username}
                onChange={(e) =>
                  setUser({
                    ...user,
                    username: e.target.value,
                  })
                }
                placeholder="Zadej své uživatelské jméno"
                className="w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-700 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 font-medium text-gray-300"
              >
                Heslo
              </label>
              <input
                type="password"
                id="password"
                value={user.password}
                onChange={(e) =>
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
                }
                placeholder="Zadej své heslo"
                className="w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-700 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className={`w-full p-3 mt-6 rounded-lg text-white font-medium focus:outline-none transition-all ${
              buttonDisabled || loading
                ? "bg-gray-700 cursor-not-allowed border-2 border-gray-600"
                : "bg-primary hover:bg-primary-dark border-2 border-primary shadow-lg transform hover:scale-105"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Přihlašování...
              </span>
            ) : (
              "Přihlásit se"
            )}
          </button>

          <div className="text-center mt-6 pt-4 border-t border-gray-700">
            <p className="text-gray-400">
              Nemáš účet?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary-light font-semibold underline transition-colors"
              >
                Zaregistruj se nyní
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
