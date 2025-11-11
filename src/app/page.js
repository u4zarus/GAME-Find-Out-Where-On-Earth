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
    <div className="flex flex-col min-h-screen bg-dark">
      <Header />
      <main className="flex-grow flex justify-center items-center px-4 sm:px-6 mt-16">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 bg-opacity-90 p-6 sm:p-8 rounded-2xl w-full sm:w-auto border-2 border-secondary shadow-xl">
          <h1 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-primary text-center max-w-xs sm:max-w-none">
            Svět pohledem družic
          </h1>
          <p className="text-lg sm:text-xl text-white text-center">
            Vyber herní režim a začni hrát
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            <Link
              href={{
                pathname: "/game",
                query: { mode: 0 },
              }}
            >
              <div className="game-mode hover:scale-105 transition-transform duration-300 group">
                <div className="relative overflow-hidden rounded-lg w-full h-32 sm:h-48">
                  <Image
                    src="/europe.jpg"
                    alt="Režim evropských měst"
                    className="rounded-lg w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent"></div>
                </div>
                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4 group-hover:text-primary transition-colors">
                  Evropská města
                </p>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/game",
                query: { mode: 1 },
              }}
            >
              <div className="game-mode hover:scale-105 transition-transform duration-300 group">
                <div className="relative overflow-hidden rounded-lg w-full h-32 sm:h-48">
                  <Image
                    src="/america.jpg"
                    alt="Režim amerických měst"
                    className="rounded-lg w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent"></div>
                </div>
                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4 group-hover:text-primary transition-colors">
                  Americká města
                </p>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/game",
                query: { mode: 2 },
              }}
            >
              <div className="game-mode hover:scale-105 transition-transform duration-300 group">
                <div className="relative overflow-hidden rounded-lg w-full h-32 sm:h-48">
                  <Image
                    src="/asia.jpg"
                    alt="Režim asijských a oceánských měst"
                    className="rounded-lg w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent"></div>
                </div>
                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4 group-hover:text-primary transition-colors">
                  Asijská a oceánská města
                </p>
              </div>
            </Link>
            <Link
              href={{
                pathname: "/game",
                query: { mode: 3 },
              }}
            >
              <div className="game-mode hover:scale-105 transition-transform duration-300 group">
                <div className="relative overflow-hidden rounded-lg w-full h-32 sm:h-48">
                  <Image
                    src="/africa.jpg"
                    alt="Režim afrických a blízkovýchodních měst"
                    className="rounded-lg w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                    width={300}
                    height={300}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent"></div>
                </div>
                <p className="text-lg sm:text-xl text-white font-bold text-center mt-4 group-hover:text-primary transition-colors">
                  Africká a blízkovýchodní města
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
