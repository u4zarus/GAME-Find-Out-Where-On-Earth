"use client";

import React, { useState } from "react";
import Earth from "@/(components)/Earth";
import QuestionImage from "@/(components)/QuestionImage/QuestionImage"; // Import the named export
import gpsImageData from "@/app/gpsImageData.json";

const GameController = () => {
    // return (
    //     <>
    //         {Object.keys(gpsImageData.gpsImageData).map((locationId) => (
    //             <QuestionImage key={locationId} location={locationId} />
    //         ))}
    //     </>
    // );

    const [currentIndex, setCurrentIndex] = useState(0);

    const veryfyGuess = (location) => {
        console.log("Veryfied");
    };

    const handleGuessButtonClick = () => {
        setCurrentIndex(currentIndex + 1);
        veryfyGuess();
    };

    return (
        <>
            {currentIndex < Object.keys(gpsImageData.gpsImageData).length && (
                <QuestionImage
                    key={Object.keys(gpsImageData.gpsImageData)[currentIndex]}
                    location={
                        Object.keys(gpsImageData.gpsImageData)[currentIndex]
                    }
                    onGuessButtonClick={handleGuessButtonClick}
                />
            )}
        </>
    );
};

export default function Home() {
    return (
        <main>
            <GameController />
            <Earth />
        </main>
    );
}
