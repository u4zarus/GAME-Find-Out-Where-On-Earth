"use client";

import Header from "@/(components)/header/Header";
import Index from "@/(components)/earth";
import { Suspense } from "react";

/**
 * The main Game component. This component is responsible for rendering the main
 * game area, the header, and the 3D globe. This page is what the user sees when he starts playing.
 *
 * @returns {ReactElement} The main game component.
 */
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

export default Game;
