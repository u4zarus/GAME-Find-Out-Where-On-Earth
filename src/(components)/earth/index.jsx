"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import gpsData from "@/app/gpsImageData.json";
import earthTexture from "@/assets/earth_tex1.jpg"; // https://www.shadedrelief.com/natural3/pages/textures.html

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

const Earth = () => {
    const mesh = useRef();
    const { camera, gl } = useThree();

    const rotationAngle = 0.5;

    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load(earthTexture.src);

    tex.wrapS = THREE.RepeatWrapping; // This sets the horizontal wrapping mode to repeat
    tex.offset.x = 0.2475; // Adjust this value to get the desired rotation

    const texMaterial = new THREE.MeshStandardMaterial({
        map: tex,
    });

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
                    1, // radius
                    (90 - middlePointGPS.latitude) * THREE.MathUtils.DEG2RAD,
                    middlePointGPS.longitude * THREE.MathUtils.DEG2RAD
                );

                console.log(
                    `Distance to ${locationData.location}: ${calculateDistance2(
                        clickedSphericalCoords,
                        middlePointSphericalCoords
                    )}`
                );
            });
        }
    };

    const calculateDistance2 = (sphericalCoord1, sphericalCoord2) => {
        const coord1 = sphericalToGeographic(sphericalCoord1);
        const coord2 = sphericalToGeographic(sphericalCoord2);

        return vincentysFormula(coord1, coord2);
    };

    function sphericalToGeographic(sphericalCoord) {
        const latitude = 90 - THREE.MathUtils.RAD2DEG * sphericalCoord.phi;
        const longitude = THREE.MathUtils.RAD2DEG * sphericalCoord.theta;

        return { latitude, longitude };
    }

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function vincentysFormula(coord1, coord2) {
        const a = 6378137; // semi-major axis of the Earth (meters)
        const b = 6356752.3142; // semi-minor axis
        const f = 1 / 298.257223563; // flattening

        const L = toRadians(coord2.longitude - coord1.longitude);
        const U1 = Math.atan((1 - f) * Math.tan(toRadians(coord1.latitude)));
        const U2 = Math.atan((1 - f) * Math.tan(toRadians(coord2.latitude)));
        const sinU1 = Math.sin(U1);
        const cosU1 = Math.cos(U1);
        const sinU2 = Math.sin(U2);
        const cosU2 = Math.cos(U2);

        let lambda = L;
        let lambdaP;
        let iterLimit = 100;
        let cosSqAlpha;
        let sigma;
        let cos2SigmaM;
        let cosSigma;
        let sinSigma;
        do {
            const sinLambda = Math.sin(lambda);
            const cosLambda = Math.cos(lambda);
            const sinSqSigma =
                (cosU2 * sinLambda) ** 2 +
                (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2;
            sinSigma = Math.sqrt(sinSqSigma);
            cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
            sigma = Math.atan2(sinSigma, cosSigma);
            const sinAlpha = (cosU1 * cosU2 * sinLambda) / sinSigma;
            cosSqAlpha = 1 - sinAlpha ** 2;
            cos2SigmaM = cosSigma - (2 * sinU1 * sinU2) / cosSqAlpha;
            const C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
            lambdaP = lambda;
            lambda =
                L +
                (1 - C) *
                    f *
                    sinAlpha *
                    (sigma +
                        C *
                            sinSigma *
                            (cos2SigmaM +
                                C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
        } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);

        if (iterLimit === 0) {
            return NaN; // formula failed to converge
        }

        const uSq = (cosSqAlpha * (a ** 2 - b ** 2)) / b ** 2;
        const A =
            1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
        const B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
        const deltaSigma =
            B *
            sinSigma *
            (cos2SigmaM +
                (B / 4) *
                    (cosSigma * (-1 + 2 * cos2SigmaM ** 2) -
                        (B / 6) *
                            cos2SigmaM *
                            (-3 + 4 * sinSigma ** 2) *
                            (-3 + 4 * cos2SigmaM ** 2)));

        const s = b * A * (sigma - deltaSigma); // distance in meters

        return s / 1000; // distance in kilometers
    }

    return (
        <mesh ref={mesh} scale={[1, 1, 1]} onClick={handleCanvasClick}>
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={texMaterial} attach="material" />
        </mesh>
    );
};

export default index;
