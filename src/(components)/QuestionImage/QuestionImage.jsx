import React from "react";
// import gpsImageData from "@/app/gpsImageData.json";
import Image from "next/image";

const QuestionImage = ({ location, onGuessButtonClick, gpsData }) => {
    // const data = gpsImageData.gpsImageData[location];

    // if (!data) {
    //     return null;
    // }
    if (!gpsData) {
        return null;
    }

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
