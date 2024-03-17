"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

extend({ OrbitControls });

const index = () => {
    return (
        <div>
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
        controlsRef.current.maxPolarAngle = Math.PI;
    }, []);

    useFrame(() => {
        controlsRef.current.update();
    });

    return <OrbitControls ref={controlsRef} args={[camera]} />;
};

const Earth = () => {
    const mesh = useRef();
    const { camera, gl } = useThree();

    useEffect(() => {
        mesh.current.rotation.x = Math.PI / 2;
    }, []);

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
            const sphericalCoords = new THREE.Spherical().setFromVector3(
                intersection.point
            );
            console.log(sphericalCoords);
        }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vUv; 

            void main() {
                vUv = position; 
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }`,
        fragmentShader: `
            varying vec3 vUv;
        
            void main() { 
                float z = vUv.z * 0.5 + 0.5; // Adjust z to range from 0 to 1
                gl_FragColor = vec4(z, 0.0, 0.0, 1.0);
            }`,
    });

    return (
        <mesh ref={mesh} scale={[3, 3, 3]} onClick={handleCanvasClick}>
            <sphereGeometry args={[1, 32, 32]} />
            {/* <meshStandardMaterial color="green" /> */}
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

export default index;
