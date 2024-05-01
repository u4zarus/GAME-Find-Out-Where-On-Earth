"use client";

import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col md:flex-row">
                {/* Left Container for Buttons */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/3 bg-gray-900">
                    <div className="flex flex-col items-center space-y-8">
                        <h1 className="text-4xl font-bold mb-8">
                            Find Where on Earth
                        </h1>
                        <div className="flex flex-col space-y-8">
                            <Link href="/game">
                                <p className="text-2xl text-white font-bold hover:text-gray-400 cursor-pointer">
                                    Singleplayer
                                </p>
                            </Link>
                            <Link href="#">
                                <p className="text-2xl text-white font-bold hover:text-gray-400 cursor-pointer">
                                    1v1 Multiplayer
                                </p>
                            </Link>
                        </div>
                        <div className="flex flex-col space-y-4">
                            {/* Add sign-in/sign-up components here */}
                        </div>
                    </div>
                </div>
                {/* Right Container for Image */}
                <div className="hidden md:block md:w-2/3 bg-gray-300 relative">
                    <Image
                        src="/earth.jpg"
                        alt="Big Image"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
