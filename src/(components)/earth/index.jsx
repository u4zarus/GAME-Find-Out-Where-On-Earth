"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import gpsData from "@/app/gpsImageData.json";
import earthTexture from "@/assets/earth_tex1.jpg";

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
        // controlsRef.current.maxPolarAngle = Math.PI;
    }, []);

    useFrame(() => {
        controlsRef.current.update();
    });

    return <OrbitControls ref={controlsRef} args={[camera]} />;
};

const Earth = () => {
    const mesh = useRef();
    const { camera, gl } = useThree();

    const rotationAngle = 0.5;

    const textureLoader = new THREE.TextureLoader();

    const texMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load(earthTexture.src),
    });

    /*
        0 - north pole (phi)
        PI - south pole (phi)
        -PI to PI - around the equator (theta)
    */

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
            const clickedSphericalCoords = new THREE.Spherical().setFromVector3(
                intersection.point
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
                    middlePointGPS.longitude * THREE.MathUtils.DEG2RAD,
                    (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
                    1 // radius
                );

                console.log(
                    `Distance to ${locationData.location}: ${calculateDistance(
                        clickedSphericalCoords,
                        middlePointSphericalCoords
                    )}`
                );
            });
        }
    };

    const calculateDistance = (
        sphericalCoord1,
        sphericalCoord2,
        radius = 6371
    ) => {
        // Convert spherical coordinates to radians
        const phi1 = sphericalCoord1.phi;
        const phi2 = sphericalCoord2.phi;
        const theta1 = sphericalCoord1.theta;
        const theta2 = sphericalCoord2.theta;

        // Calculate differences
        const deltaPhi = phi2 - phi1;
        const deltaTheta = theta2 - theta1;

        // Haversine formula
        const a =
            Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) *
                Math.cos(phi2) *
                Math.sin(deltaTheta / 2) *
                Math.sin(deltaTheta / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        // Distance in kilometers
        const distance = radius * c;

        return distance;
    };

    // const shaderMaterial = new THREE.ShaderMaterial({
    //     vertexShader: `
    //         varying vec3 vUv;

    //         void main() {
    //             vUv = position;
    //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    //         }`,
    //     fragmentShader: `
    //         varying vec3 vUv;

    //         void main() {
    //             float z = vUv.z * 0.5 + 0.5; // Adjust z to range from 0 to 1
    //             gl_FragColor = vec4(z, 0.0, 0.0, 1.0);
    //         }`,
    // });

    return (
        <mesh ref={mesh} scale={[3, 3, 3]} onClick={handleCanvasClick}>
            <sphereGeometry args={[1, 32, 32]} />
            {/* <meshStandardMaterial color="green" /> */}
            {/* <primitive object={shaderMaterial} attach="material" /> */}
            {/* <primitive object={createEarthGeometry()} attach="geometry" /> */}
            <primitive object={texMaterial} attach="material" />
        </mesh>
    );
};

export default index;
