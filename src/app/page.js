"use client";

import React, { useState } from "react";
import Earth from "@/(components)/earth";
import QuestionImage from "@/(components)/QuestionImage/QuestionImage"; // Import the named export
import gpsImageData from "@/app/gpsImageData.json";

const GameController = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickedSphericalCoords, setClickedSphericalCoords] = useState(null);

    const veryfyGuess = (location) => {
        console.log("Veryfied");
    };

    const handleGuessButtonClick = () => {
        setCurrentIndex(currentIndex + 1);
        veryfyGuess();
    };

    const handleCanvasClick = (clickedSphericalCoords) => {
        setClickedSphericalCoords(clickedSphericalCoords);
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
                    clickedSphericalCoords={clickedSphericalCoords}
                />
            )}
        </>
    );
};

const Home = () => {
    return (
        <main>
            <GameController />
            <Earth />
        </main>
    );
};

export default Home;
