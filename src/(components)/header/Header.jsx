import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosCloseCircle } from "react-icons/io";

const Header = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
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

            {/* Navigation */}
            <nav className="flex space-x-4">
                <a
                    className="hover:text-gray-300 cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    How to Play
                </a>
            </nav>

            {/* Profile */}
            <div className="flex items-center space-x-4">
                <Image
                    src="/profile.jpg"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                />
            </div>

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
                                Try to guess the location from the sattelite
                                photo on the Earth!
                            </li>
                            <li className="pb-2">
                                Double click (single tap on mobile) on the Earth
                                to place a guess marker, then press Guess button
                                to take a guess.
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
