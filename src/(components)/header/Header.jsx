import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { IoIosCloseCircle } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const res = await axios.get("/api/users/me");
                setIsLoggedIn(!!res.data?.data);
            } catch (error) {
                setIsLoggedIn(false);
                document.cookie =
                    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        };
        checkUserStatus();
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white fixed w-full z-50">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src="/logo_.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="cursor-pointer"
                    />
                </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 ml-auto">
                <Link
                    href="/leaderboard"
                    className="hover:text-gray-300 cursor-pointer"
                >
                    Leaderboard
                </Link>
                <a
                    className="hover:text-gray-300 cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    How to Play
                </a>

                {/* Conditional Links */}
                {!isLoggedIn ? (
                    <>
                        <Link
                            href="/login"
                            className="hover:text-gray-300 cursor-pointer"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/signup"
                            className="hover:text-gray-300 cursor-pointer"
                        >
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <Link
                        href="/profile"
                        className="hover:text-gray-300 cursor-pointer"
                    >
                        Profile
                    </Link>
                )}
            </nav>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center ml-auto">
                <button onClick={toggleMobileMenu} aria-label="Toggle menu">
                    {isMobileMenuOpen ? (
                        <FaTimes size={24} />
                    ) : (
                        <FaBars size={24} />
                    )}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <nav className="absolute top-full right-0 bg-gray-800 w-full md:hidden flex flex-col items-center space-y-4 py-4">
                    <Link
                        href="/leaderboard"
                        className="hover:text-gray-300 cursor-pointer"
                        onClick={toggleMobileMenu}
                    >
                        Leaderboard
                    </Link>
                    <a
                        className="hover:text-gray-300 cursor-pointer"
                        onClick={() => {
                            setShowModal(true);
                            toggleMobileMenu();
                        }}
                    >
                        How to Play
                    </a>

                    {/* Conditional Links */}
                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="hover:text-gray-300 cursor-pointer"
                                onClick={toggleMobileMenu}
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="hover:text-gray-300 cursor-pointer"
                                onClick={toggleMobileMenu}
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/profile"
                            className="hover:text-gray-300 cursor-pointer"
                            onClick={toggleMobileMenu}
                        >
                            Profile
                        </Link>
                    )}
                </nav>
            )}

            {showModal ? (
                <InfoModal onClose={() => setShowModal(false)} />
            ) : null}
        </header>
    );
};

const InfoModal = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div
            className={`modal ${isOpen ? "is-active" : ""}`}
            style={{ position: "fixed", zIndex: 9999 }}
        >
            <div className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="modal-content bg-white rounded-lg shadow-xl w-3/4 md:w-1/2 lg:w-1/3">
                    <div className="box p-6 relative">
                        <button
                            className="absolute top-2 right-2 text-3xl"
                            onClick={handleClose}
                        >
                            <IoIosCloseCircle fill="black" />
                        </button>
                        <p className="text-lg text-gray-950 font-semibold mb-2">
                            How to Play:
                        </p>
                        <ul className="list-disc list-inside text-gray-600">
                            <li className="pb-2">
                                Try to guess the location from the satellite
                                photo on the Earth!
                            </li>
                            <li className="pb-2">
                                Double click (single tap on mobile) on the Earth
                                to place a guess marker, then press Guess button
                                to take a guess.
                            </li>
                            <li className="pb-2">
                                The closer your guess is to the actual location,
                                the more points you earn (0 - 1000).
                            </li>
                            <li className="pb-2">
                                You need to guess the center of the image.
                            </li>
                            <li className="pb-2">
                                Enable GPU acceleration in your browser settings
                                for better performance.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
