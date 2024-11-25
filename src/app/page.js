"use client";

import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-950">
            <Header />
            <main className="flex-grow flex justify-center items-center px-4 sm:px-6 mt-16">
                <div className="flex flex-col items-center space-y-6 sm:space-y-8 bg-gray-900 bg-opacity-80 p-6 sm:p-8 rounded-lg w-full sm:w-auto">
                    <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-white text-center max-w-xs sm:max-w-none">
                        Find where on Earth
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
                                    src="/pexels-elina-sazonova-1850619.jpg"
                                    alt="Cities Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    Cities
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
                                    src="/pexels-dick-hoskins-22993523-6642124.jpg"
                                    alt="Famous Landmarks Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    Famous Landmarks
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
                                    src="/mix.jpg"
                                    alt="Mixed Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4">
                                    Mixed Mode
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
