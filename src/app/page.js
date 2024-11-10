"use client";

import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-950">
                <div className="flex flex-col items-center space-y-8 bg-gray-900 bg-opacity-80 p-8 rounded-lg">
                    <h1 className="text-4xl font-bold mb-8 text-white text-center">
                        Find where on Earth
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Link
                            href={{
                                pathname: "/game",
                                query: { mode: 0 },
                            }}
                        >
                            <div className="game-mode hover:scale-105 transition-transform">
                                <Image
                                    src="/pexels-elina-sazonova-1850619.jpg"
                                    alt="Capitals Mode"
                                    className="rounded-lg w-full h-32 sm:h-48 object-cover"
                                    width={300}
                                    height={300}
                                />
                                <p className="text-xl sm:text-2xl text-white font-bold text-center mt-4">
                                    Capitals
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
                                <p className="text-xl sm:text-2xl text-white font-bold text-center mt-4">
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
                                <p className="text-xl sm:text-2xl text-white font-bold text-center mt-4">
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
