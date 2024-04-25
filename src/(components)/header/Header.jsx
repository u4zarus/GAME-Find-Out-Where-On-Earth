import Image from "next/image";

const Header = () => {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
            {/* Logo */}
            <div className="flex items-center">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="cursor-pointer"
                />
            </div>

            {/* Navigation */}
            <nav className="flex space-x-4">
                <a
                    href="#gamemodes"
                    className="hover:text-gray-300 cursor-pointer"
                >
                    Game Modes
                </a>
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
