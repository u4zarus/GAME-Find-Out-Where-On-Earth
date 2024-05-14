"use client";

import Header from "@/(components)/header/Header";
import Footer from "@/(components)/footer/Footer";
import Link from "next/link";

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main
                className="flex-grow flex justify-center items-center bg-cover"
                style={{ backgroundImage: `url('/bg.png')` }}
            >
                {/* Center Container for Title and Buttons */}
                <div className="flex flex-col items-center space-y-8 bg-gray-900 bg-opacity-70 p-8 rounded-lg">
                    <h1 className="text-4xl font-bold mb-8 text-white text-center">
                        Find Where on Earth
                    </h1>
                    <div className="flex flex-col space-y-8">
                        <Link href="/game">
                            <p className="text-2xl text-white text-center font-bold hover:text-gray-400 cursor-pointer">
                                Play
                            </p>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
