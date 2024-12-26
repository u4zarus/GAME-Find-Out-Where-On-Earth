"use client";

import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Home component renders the main landing page for the application.
 *
 * This component uses the Next.js useRouter hook to refresh the page upon
 * mounting. It displays a header, a footer, and a main section with options
 * to select different game modes. Each game mode is represented by a link
 * with an image and a title, redirecting to the game page with the respective
 * mode query parameter.
 *
 * The layout is responsive and styled using Tailwind CSS classes, providing
 * a full-screen height, dark background, and flexible grid layout for game
 * mode selection. The header and footer components are included for
 * consistent UI presentation.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-950">
            <Header />
            <main className="flex-grow flex justify-center items-center px-4 sm:px-6 mt-16">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8 bg-gray-900 bg-opacity-80 p-6 sm:p-8 rounded-lg w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white text-center max-w-xs sm:max-w-none">
                        Find out where on Earth
                    </h1>
                    <p className="text-lg sm:text-xl text-white text-center">
                        Select a game mode to start playing
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
                        <Link
                            href={{
                                pathname: "/game",
                                query: { mode: 0 },
                            }}
                        >
                            <div className="game-mode hover:scale-105 transition-transform">
                                <Image
                                    src="/europe.jpg"
                                    alt="European Cities Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    European Cities
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={{
                                pathname: "/game",
                                query: { mode: 1 },
                            }}
                        >
                            <div className="game-mode hover:scale-105 transition-transform">
                                <Image
                                    src="/america.jpg"
                                    alt="American Cities Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    American Cities
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={{
                                pathname: "/game",
                                query: { mode: 2 },
                            }}
                        >
                            <div className="game-mode hover:scale-105 transition-transform">
                                <Image
                                    src="/asia.jpg"
                                    alt="Asian and Oceanian Cities Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    Asian and Oceanian Cities
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={{
                                pathname: "/game",
                                query: { mode: 3 },
                            }}
                        >
                            <div className="game-mode hover:scale-105 transition-transform">
                                <Image
                                    src="/africa.jpg"
                                    alt="African and Middle Eastern Cities Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    African and Middle Eastern Cities
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
