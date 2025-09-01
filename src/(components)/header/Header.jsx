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
        <header className="fixed top-0 left-0 w-full z-50 bg-dark text-white border-b-2 border-secondary">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/logo_.png"
                            alt="Logo"
                            width={60}
                            height={40}
                            className="cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
                    <Link
                        href="/leaderboard"
                        className="hover:text-primary transition"
                    >
                        Leaderboard
                    </Link>
                    <button
                        onClick={() => setShowModal(true)}
                        className="hover:text-primary transition"
                    >
                        How to Play
                    </button>

                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                className="hover:text-primary transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="hover:text-primary transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/profile"
                            className="hover:text-primary transition"
                        >
                            Profile
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Icon */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        className="text-white"
                    >
                        {isMobileMenuOpen ? (
                            <FaTimes size={28} />
                        ) : (
                            <FaBars size={28} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <nav className="bg-dark border-t border-gray-800 flex flex-col items-center py-4 space-y-4 md:hidden text-white font-medium">
                    <Link
                        href="/leaderboard"
                        onClick={toggleMobileMenu}
                        className="hover:text-primary"
                    >
                        Leaderboard
                    </Link>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            toggleMobileMenu();
                        }}
                        className="hover:text-primary"
                    >
                        How to Play
                    </button>

                    {!isLoggedIn ? (
                        <>
                            <Link
                                href="/login"
                                onClick={toggleMobileMenu}
                                className="hover:text-primary"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={toggleMobileMenu}
                                className="hover:text-primary"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/profile"
                            onClick={toggleMobileMenu}
                            className="hover:text-primary"
                        >
                            Profile
                        </Link>
                    )}
                </nav>
            )}

            {showModal && <InfoModal onClose={() => setShowModal(false)} />}
        </header>
    );
};

const InfoModal = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    /**
     * Closes the modal by setting its open state to false and calls the onClose callback.
     */
    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 ${
                isOpen ? "flex" : "hidden"
            } items-center justify-center`}
        >
            <div
                className="fixed inset-0 bg-black bg-opacity-70"
                onClick={handleClose}
            ></div>
            <div className="relative bg-gray-900 rounded-2xl shadow-xl w-11/12 md:w-3/4 lg:w-1/2 xl:w-2/5 max-h-[90vh] overflow-y-auto border-2 border-secondary">
                <div className="p-6 relative">
                    <button
                        className="absolute top-4 right-4 text-3xl hover:text-primary transition-colors"
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <IoIosCloseCircle
                            className="text-white hover:text-primary"
                            size={32}
                        />
                    </button>
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        How to Play:
                    </h2>
                    <ul className="space-y-3 text-gray-200">
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>
                                Try to guess the location from the satellite
                                photo on the Earth!
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>
                                Double click (single tap on mobile) on the Earth
                                to place a guess marker, then press Guess button
                                to take a guess.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>
                                The closer your guess is to the actual location,
                                the more points you earn (0 - 1000).
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>
                                You need to guess where is the place
                                (city/landmark) located, not the image itself.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
                            <span>
                                Enable GPU acceleration in your browser settings
                                for better performance.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
