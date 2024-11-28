"use client";

import Header from "@/(components)/header/Header";
import Index from "@/(components)/earth";
import { Suspense } from "react";

const Game = () => {
    return (
        <main>
            <style jsx global>{`
                body {
                    overflow: hidden;
                }
            `}</style>
            <Header />
            <Suspense fallback={<div>Loading game...</div>}>
                <Index />
            </Suspense>
        </main>
    );
};

// export const dynamic = "force-dynamic";

export default Game;
