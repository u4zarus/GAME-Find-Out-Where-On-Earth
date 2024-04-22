"use client";

import React, { useState, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gpsData from "@/app/gpsImageData.json";
import { calculateDistance2 } from "@/utils/coordUtils";
import Image from "next/image";

import "@/app/globals.css";

import earthTexture from "@/assets/earth_tex2.jpg"; // https://www.shadedrelief.com/natural3/pages/textures.html

extend({ OrbitControls });

const Index = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickedSphericalCoords, setClickedSphericalCoords] = useState(null);

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
            alert(
                `The place was - ${location.location}
                You guess is ${distance.toFixed(0)} km away`
            );
        }
    };

    const handleGuessButtonClick = () => {
        setCurrentIndex(currentIndex + 1);
        verifyGuess(
            gpsData.gpsImageData[
                Object.keys(gpsData.gpsImageData)[currentIndex]
            ],
            clickedSphericalCoords
        );
    };

    return (
        <div>
            <div>
                <div>
                    {currentIndex <
                        Object.keys(gpsData.gpsImageData).length && (
                        <QuestionImage
                            location={
                                Object.keys(gpsData.gpsImageData)[currentIndex]
                            }
                            onGuessButtonClick={handleGuessButtonClick}
                        />
                    )}
                    <div>
                        <h1 className="text-blue-500">
                            Double click to place a marker
                        </h1>
                        <h1>Press Guess button when ready</h1>
                    </div>
                </div>
            </div>

            <div>
                <Canvas>
                    <OrbitControlsCustom />
                    <ambientLight intensity={2} />
                    <directionalLight intensity={1} position={[2, 1, 1]} />
                    <Earth
                        setClickedSphericalCoords={setClickedSphericalCoords}
                    />
                </Canvas>
            </div>
        </div>
    );
};

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
    }, []);

    useFrame(() => {
        controlsRef.current.update();
    });

    return <OrbitControls ref={controlsRef} args={[camera]} />;
};

const QuestionImage = ({ location, onGuessButtonClick }) => {
    const data = gpsData.gpsImageData[location];

    if (!data) {
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
            <button
                onClick={onGuessButtonClick}
                className="bg-blue-500 text-red-600"
            >
                Guess
            </button>
        </div>
    );
};

const Earth = ({ setClickedSphericalCoords }) => {
    const mesh = useRef();
    const { camera, gl } = useThree();
    const [markerPosition, setMarkerPosition] = useState(null);

    const texture = useMemo(() => {
        const textureLoader = new THREE.TextureLoader();
        const tex = textureLoader.load(earthTexture.src);
        tex.wrapS = THREE.RepeatWrapping; // This sets the horizontal wrapping mode to repeat
        tex.offset.x = 0.2475; // Adjust this value to get the desired rotation
        return tex;
    }, []);

    const texMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            map: texture,
        });
    }, [texture]);

    const handleCanvasClick = (event) => {
        // if (event.button !== 0) return;

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
            setMarkerPosition(intersection.point);
        }
    };

    return (
        <mesh ref={mesh} scale={[1, 1, 1]} onDoubleClick={handleCanvasClick}>
            {/* <GameController /> */}
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={texMaterial} attach="material" />
            {markerPosition && (
                <mesh position={markerPosition}>
                    <sphereGeometry args={[0.002, 16, 16]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            )}
        </mesh>
    );
};

export default Index;
