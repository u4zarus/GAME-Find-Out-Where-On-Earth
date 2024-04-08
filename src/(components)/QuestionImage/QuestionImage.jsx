import React from "react";
import gpsImageData from "@/app/gpsImageData.json";
import Image from "next/image";
import * as THREE from "three";
import { calculateDistance2 } from "@/utils/coordUtils.js";

const QuestionImage = ({
    location,
    onGuessButtonClick,
    clickedSphericalCoords,
}) => {
    const data = gpsImageData.gpsImageData[location];

    if (!data) {
        return null;
    }

    Object.values(gpsImageData.gpsImageData).forEach((locationData) => {
        const middlePointGPS = {
            latitude: (locationData.latitude_tl + locationData.latitude_br) / 2,
            longitude:
                (locationData.longitude_tl + locationData.longitude_br) / 2,
        };

        const middlePointSphericalCoords = new THREE.Spherical(
            1, // radius
            (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
            middlePointGPS.longitude * THREE.MathUtils.DEG2RAD
        );

        if (clickedSphericalCoords) {
            console.log(
                `Distance to ${locationData.location}: ${calculateDistance2(
                    clickedSphericalCoords,
                    middlePointSphericalCoords
                )}`
            );
        }
    });

    return (
        <div>
            <Image
                src={data.img_path}
                alt={data.location}
                width={300}
                height={300}
                style={{ width: "auto", height: "auto" }}
                priority={true}
            />
            <button onClick={onGuessButtonClick}>Guess</button>
        </div>
    );
};

export default QuestionImage;
