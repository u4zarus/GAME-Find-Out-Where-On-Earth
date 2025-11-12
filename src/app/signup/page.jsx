"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Renders the sign up page for the application.
 *
 * This component provides a user interface for users to sign up by entering a
 * username and password. It manages the state of user credentials, loading
 * status, and button disabled state. The component also handles sign up requests
 * to the server and provides feedback to users via alerts and toasts based on the
 * success or failure of the sign up attempt.
 *
 * @returns {JSX.Element} The rendered sign up page component.
 */
const SignupPage = () => {
    const router = useRouter();

    const [user, setUser] = useState({
        password: "",
        username: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    /**
     * Handles a sign up request to the server.
     *
     * Sends a POST request to the sign up API endpoint with the current user
     * credentials and withCredentials set to true. If the request is successful,
     * redirects to the login page. If the request fails, logs the error and
     * shows an error toast. Finally, sets the loading state to false.
     */
    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user, {
                withCredentials: true,
            });
            console.log("Sign Up successful", response.data);
            router.push("/login");
        } catch (error) {
            console.log("Sign Up failed", error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(user);

        if (user.password.length > 0 && user.username.length > 0) {
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
                        {loading ? "Zpracovávám..." : "Vytvoř si účet"}
                    </h1>
                    <hr className="border-gray-700 mb-6" />

                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 font-medium text-gray-300"
                            >
                                {t("login.username")}
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
                                placeholder={t("login.usernamePlaceholder")}
                                className="w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-700 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 font-medium text-gray-300"
                            >
                                {t("login.password")}
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
                                placeholder={t("login.passwordPlaceholder")}
                                className="w-full p-3 rounded-lg bg-gray-900 border-2 border-gray-700 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onSignup}
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
                                {t("login.creating")}
                            </span>
                        ) : (
                            t("login.button")
                        )}
                    </button>

                    <div className="text-center mt-6 pt-4 border-t border-gray-700">
                        <p className="text-gray-400">
                            {t("login.alreadyHaveAccount")}{" "}
                            <Link
                                href="/login"
                                className="text-primary hover:text-primary-light font-semibold underline transition-colors"
                            >
                                {t("login.button")}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer with space theme */}
            <Footer />
        </div>
    );
};

export default SignupPage;
