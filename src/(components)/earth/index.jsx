"use client";

import React, { useState, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gpsData from "@/app/gpsImageData.json";
import { calculateDistance2 } from "@/utils/coordUtils";
import { QuestionImage } from "@/(components)/QuestionImage/QuestionImage";

import earthTexture from "@/assets/earth_tex2.jpg"; // https://www.shadedrelief.com/natural3/pages/textures.html

extend({ OrbitControls });

const index = () => {
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Canvas>
                <OrbitControlsCustom />
                <ambientLight intensity={2} />
                <directionalLight intensity={1} position={[2, 1, 1]} />
                <Earth />
            </Canvas>
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

const Earth = ({ onCanvasClick }) => {
    const mesh = useRef();
    const { camera, gl } = useThree();
    const [clickedSphericalCoords, setClickedSphericalCoords] = useState(null);
    // const [middlePointSphericalCoords, setMiddlePointSphericalCoords] =
    //     useState(null);

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
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, camera);

        const intersects = raycaster.intersectObject(mesh.current);

        if (intersects.length > 0) {
            const intersection = intersects[0];
            // const clickedSphericalCoords = new THREE.Spherical().setFromVector3(
            //     intersection.point
            // );
            setClickedSphericalCoords(
                new THREE.Spherical().setFromVector3(intersection.point)
            );
            console.log(clickedSphericalCoords);

            // Coordinate comparison logic
            Object.values(gpsData.gpsImageData).forEach((locationData) => {
                const middlePointGPS = {
                    latitude:
                        (locationData.latitude_tl + locationData.latitude_br) /
                        2,
                    longitude:
                        (locationData.longitude_tl +
                            locationData.longitude_br) /
                        2,
                };

                const middlePointSphericalCoords = new THREE.Spherical(
                    1, // radius
                    (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
                    middlePointGPS.longitude * THREE.MathUtils.DEG2RAD
                );

                // setMiddlePointSphericalCoords(
                //     1, // radius
                //     (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
                //     middlePointGPS.longitude * THREE.MathUtils.DEG2RAD
                // );
                if (clickedSphericalCoords) {
                    console.log(
                        `Distance to ${
                            locationData.location
                        }: ${calculateDistance2(
                            clickedSphericalCoords,
                            middlePointSphericalCoords
                        )}`
                    );
                }
            });
        }
    };

    return (
        <mesh ref={mesh} scale={[1, 1, 1]} onClick={handleCanvasClick}>
            {/* <GameController /> */}
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={texMaterial} attach="material" />
        </mesh>
    );
};

export default index;
