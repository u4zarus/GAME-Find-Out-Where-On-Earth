"use client";

import React, { useState, useMemo, use } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gpsData from "@/app/gpsImageData.json";
import { calculateDistance2 } from "@/utils/coordUtils";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";
import { isMobile } from "react-device-detect";
import axios from "axios";
import toast from "react-hot-toast";

import earthTexture from "@/assets/earth_tex1.jpg"; // https://www.shadedrelief.com/natural3/pages/textures.html

extend({ OrbitControls });

// ------------------ Index ------------------
const Index = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickedSphericalCoords, setClickedSphericalCoords] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ location: "", distance: "" });
    const [plusPoints, setPlusPoints] = useState(0);
    const [distances, setDistances] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    //
    const [actualLocation, setActualLocation] = useState(null);
    const [guessDisabled, setGuessDisabled] = useState(false);

    const verifyGuess = (location, clickedSphericalCoords) => {
        if (clickedSphericalCoords) {
            const middlePointGPS = {
                latitude: (location.latitude_tl + location.latitude_br) / 2,
                longitude: (location.longitude_tl + location.longitude_br) / 2,
            };

            const middlePointSphericalCoords = new THREE.Spherical(
                1, // radius
                (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
                middlePointGPS.longitude * THREE.MathUtils.DEG2RAD
            );

            const distance = calculateDistance2(
                clickedSphericalCoords,
                middlePointSphericalCoords
            );

            setDistances([...distances, distance]);

            const fixedDistance = distance.toFixed(0);
            const maxDistance = 5000; // Maximum distance for which score is 0
            const decayRate = 3; // Increase this to make the score decrease more rapidly
            let newScore = Math.max(
                0,
                1000 * Math.exp((-fixedDistance * decayRate) / maxDistance)
            );

            newScore = Math.round(newScore);
            setPlusPoints(newScore);

            setScore((prevScore) => prevScore + newScore);

            setModalData({
                location: location.location,
                distance: fixedDistance,
            });
            setModalOpen(true);
            setActualLocation(middlePointSphericalCoords);
        }
    };
    //
    const handleNextImage = () => {
        setCurrentIndex(currentIndex + 1);
        setModalOpen(false);
        setActualLocation(null);
        setClickedSphericalCoords(null);
        setGuessDisabled(false); // Re-enable the guess button when moving to the next image
        const length = Object.keys(gpsData.gpsImageData).length;
        if (currentIndex + 1 === length) {
            setGameOver(true);
        }
    };

    const handleGuessButtonClick = () => {
        // verifyGuess(
        //     gpsData.gpsImageData[
        //         Object.keys(gpsData.gpsImageData)[currentIndex]
        //     ],
        //     clickedSphericalCoords
        // );
        // setClickedSphericalCoords(null);

        if (!guessDisabled) {
            verifyGuess(
                gpsData.gpsImageData[
                    Object.keys(gpsData.gpsImageData)[currentIndex]
                ],
                clickedSphericalCoords
            );
            setGuessDisabled(true);
        }
        setClickedSphericalCoords(null);
    };

    return (
        <div
            className="flex flex-col items-center justify-center h-full w-full overflow-hidden"
            style={{
                backgroundImage: `url('bbg.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="flex flex-col items-center justify-center space-y-4">
                {currentIndex < Object.keys(gpsData.gpsImageData).length ? (
                    <QuestionImage
                        location={
                            Object.keys(gpsData.gpsImageData)[currentIndex]
                        }
                        onGuessButtonClick={handleGuessButtonClick}
                        clickedSphericalCoords={clickedSphericalCoords}
                        guessDisabled={guessDisabled}
                    />
                ) : null}
            </div>
            {actualLocation ? (
                <>
                    <button
                        onClick={handleNextImage}
                        className="fixed bottom-10 right-10 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 z-50"
                    >
                        Next Image
                    </button>
                </>
            ) : null}

            <div className="fixed top-14 left-2 px-1 py-2 rounded-md text-xl z-50">
                <p className="hidden sm:block">Current Score: {score}</p>
                <p className="sm:hidden">{score}</p>
            </div>

            {modalOpen ? (
                <Modal
                    location={modalData.location}
                    distance={modalData.distance}
                    points={plusPoints}
                    onClose={() => setModalOpen(false)}
                />
            ) : null}

            {gameOver ? (
                <EndGameModal
                    gpsImageData={gpsData.gpsImageData}
                    distances={distances}
                    totalScore={score}
                    onClose={() => setGameOver(false)}
                />
            ) : null}

            <div className="mt-14">
                <Canvas style={{ width: "100vw", height: "100vh" }}>
                    <OrbitControlsCustom />
                    <ambientLight intensity={2} />
                    <directionalLight intensity={1} position={[2, 1, 1]} />
                    <Earth
                        setClickedSphericalCoords={setClickedSphericalCoords}
                        clickedSphericalCoords={clickedSphericalCoords}
                        actualLocation={actualLocation}
                    />
                </Canvas>
            </div>
        </div>
    );
};

// ------------------ OrbitControlsCustom ------------------
const OrbitControlsCustom = () => {
    const { camera } = useThree();
    const controlsRef = useRef();

    useEffect(() => {
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.25;
        controlsRef.current.enableZoom = true;
        controlsRef.current.rotateSpeed = 0.5;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = false;

        controlsRef.current.minDistance = 1.1; // Minimum distance from the camera to the target
        controlsRef.current.maxDistance = 2; // Maximum distance from the camera to the target
    }, []);

    useFrame(() => {
        controlsRef.current.update();
    });

    return <OrbitControls ref={controlsRef} args={[camera]} />;
};

// ------------------ Question Image ------------------
const QuestionImage = ({
    location,
    onGuessButtonClick,
    clickedSphericalCoords,
    guessDisabled,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const data = gpsData.gpsImageData[location];

    if (!data) {
        return null;
    }

    return (
        <div className="fixed top-12 right-0 m-4 border-2 border-blue-500 rounded-lg shadow-lg bg-gray-700 z-10">
            <div className="image-container">
                <Image
                    src={data.img_path}
                    alt={data.location}
                    width={300}
                    height={300}
                    className="w-auto h-auto cursor-pointer"
                    priority={true}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
            <button
                onClick={onGuessButtonClick}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-500 disabled:opacity-50"
                disabled={!clickedSphericalCoords || guessDisabled}
            >
                Guess
            </button>

            {isModalOpen ? (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20"
                    onClick={() => setIsModalOpen(false)}
                >
                    <Image
                        src={data.img_path}
                        alt={data.location}
                        width={1000}
                        height={1000}
                        className="w-auto h-auto"
                        priority={true}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : null}
        </div>
    );
};

// ------------------ Earth ------------------
const Earth = ({
    setClickedSphericalCoords,
    clickedSphericalCoords,
    actualLocation,
}) => {
    const mesh = useRef();
    const { camera, gl } = useThree();
    const [markerPosition, setMarkerPosition] = useState(null);

    const texture = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        const tex = textureLoader.load(earthTexture.src);
        tex.wrapS = THREE.RepeatWrapping;
        tex.offset.x = 0.2475;
        return tex;
    }, []);

    const texMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({ map: texture });
    }, [texture]);

    const handleCanvasClick = (event) => {
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);

        const intersects = raycaster.intersectObject(mesh.current);
        if (intersects.length > 0) {
            const intersection = intersects[0];
            setClickedSphericalCoords(
                new THREE.Spherical().setFromVector3(intersection.point)
            );
            setMarkerPosition(intersection.point); // Keep the guess marker position
        }
    };

    const createCurveBetweenPoints = (point1, point2) => {
        const numPoints = 100;
        const curve = new THREE.CatmullRomCurve3(
            [point1, ...interpolatePoints(point1, point2, numPoints), point2],
            false,
            "catmullrom",
            0.5
        );
        return curve.getPoints(numPoints);
    };

    const interpolatePoints = (point1, point2, numPoints) => {
        const points = [];
        for (let i = 1; i < numPoints; i++) {
            const alpha = i / numPoints;
            const interpolated = new THREE.Vector3()
                .copy(point1)
                .lerp(point2, alpha)
                .normalize()
                .multiplyScalar(1); // Keep points on the sphere's surface
            points.push(interpolated);
        }
        return points;
    };

    return (
        <mesh
            ref={mesh}
            scale={[1, 1, 1]}
            onDoubleClick={!isMobile ? handleCanvasClick : null}
            onClick={isMobile ? handleCanvasClick : null}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={texMaterial} attach="material" />

            {/* User guess mark */}
            {markerPosition ? (
                <mesh position={markerPosition}>
                    <sphereGeometry args={[0.002, 16, 16]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            ) : null}

            {/* Actual location reveal mark */}
            {actualLocation ? (
                <mesh
                    position={new THREE.Vector3().setFromSpherical(
                        actualLocation
                    )}
                >
                    <sphereGeometry args={[0.003, 16, 16]} />
                    <meshBasicMaterial color="green" />
                </mesh>
            ) : null}

            {/* A line between the marks */}
            {markerPosition && actualLocation ? (
                <line>
                    <bufferGeometry
                        attach="geometry"
                        onUpdate={(geometry) => {
                            const curvePoints = createCurveBetweenPoints(
                                markerPosition,
                                new THREE.Vector3().setFromSpherical(
                                    actualLocation
                                )
                            );
                            const positions = new Float32Array(
                                curvePoints.flatMap((point) => [
                                    point.x,
                                    point.y,
                                    point.z,
                                ])
                            );
                            geometry.setAttribute(
                                "position",
                                new THREE.BufferAttribute(positions, 3)
                            );
                        }}
                    />
                    <lineBasicMaterial
                        attach="material"
                        color="yellow"
                        linewidth={2}
                    />
                </line>
            ) : null}
        </mesh>
    );
};

// ------------------ Modal ------------------
const Modal = ({ location, distance, points, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <div
            className={`modal ${isOpen ? "is-active" : ""}`}
            style={{ position: "fixed", zIndex: 9999 }}
        >
            <div className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="modal-content bg-white rounded-lg shadow-xl w-3/4 md:w-1/2 lg:w-1/3">
                    <div className="box p-6 relative">
                        <button
                            className="absolute top-2 right-2 text-3xl"
                            onClick={handleClose}
                        >
                            <IoIosCloseCircle fill="black" />
                        </button>
                        <p className="text-lg text-gray-950 font-semibold mb-2">
                            The place was - {location}
                        </p>
                        <p className="text-lg text-gray-950 font-semibold">
                            Your guess is {distance} km away
                        </p>
                        <p className="text-lg text-green-600 font-semibold">
                            +{points} points
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ------------------ EndGameModal ------------------
const EndGameModal = ({ gpsImageData, distances, totalScore, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [data, setData] = useState(null);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const handleTryAgain = () => {
        window.location.reload();
    };

    const updateMaxScore = async (totalScore) => {
        try {
            const response = await axios.post("/api/users/updateMaxScore", {
                totalScore, // Pass only totalScore, backend will get userId from token
            });
            console.log("Score updated successfully", response.data);
            toast.success("Score updated successfully");
        } catch (error) {
            console.error("Score update failed", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        updateMaxScore(totalScore);
    }, []);

    return (
        <div
            className={`modal ${isOpen ? "is-active" : ""}`}
            style={{ position: "fixed", zIndex: 9999 }}
        >
            <div className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="modal-content bg-white rounded-lg shadow-xl w-3/4 md:w-1/2 lg:w-1/3 p-6">
                    <button
                        className="absolute top-2 right-2 text-3xl"
                        onClick={handleClose}
                    >
                        <IoIosCloseCircle fill="black" />
                    </button>
                    <h1 className="text-2xl text-gray-950 font-semibold mb-4">
                        Game Over
                    </h1>
                    <p className="text-lg sm:text-base text-gray-950 font-semibold mb-2">
                        Total Score: {totalScore}
                    </p>
                    <div className="mt-4 mb-6">
                        <h2 className="text-lg sm:text-base text-gray-950 font-semibold mb-2">
                            Distances:
                        </h2>
                        <ul>
                            {Object.keys(gpsImageData).map((key, index) => (
                                <li
                                    key={index}
                                    className="text-gray-600 text-sm sm:text-base"
                                >
                                    Location: {gpsImageData[key].location},
                                    Distance: {distances[index].toFixed(0)} km
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button
                        onClick={handleTryAgain}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Index;
