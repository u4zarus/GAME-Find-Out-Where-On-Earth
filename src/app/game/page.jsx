"use client";

import Header from "@/(components)/header/Header";
import Index from "@/(components)/earth";

const Game = () => {
    return (
        <main>
            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
            <Header />
            <Index />
        </main>
    );
};

export default Game;
