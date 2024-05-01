import Image from "next/image";
import Link from "next/link";

const Header = () => {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <Image
                        src="/logo.png"
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
                    onClick={() =>
                        alert(
                            `Double click on the Earth to place a guess marker, then press Guess button
                            \nEnable GPU acceleration for better performance.`
                        )
                    }
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
        </header>
    );
};

export default Header;
