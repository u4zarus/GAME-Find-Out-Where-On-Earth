"use client";

import React, { useState, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { calculateDistance2, calculateDistanceH } from "@/utils/coordUtils";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";
import { isMobile } from "react-device-detect";
import axios from "axios";
import toast from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";

import earthTexture from "@/assets/earth_tex1.jpg"; // https://www.shadedrelief.com/natural3/pages/textures.html
import { useSearchParams } from "next/navigation";

extend({ OrbitControls });

/**
 * The main component of the game. It renders the UI for the game and handles
 * the game logic. It loads the game data from the JSON files and renders the
 * game UI. It also handles the user's guesses and updates the score.
 *
 * @returns {ReactElement} The rendered game component.
 */
const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickedSphericalCoords, setClickedSphericalCoords] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    location: "",
    distance: "",
  });
  const [plusPoints, setPlusPoints] = useState(0);
  const [distances, setDistances] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [actualLocation, setActualLocation] = useState(null);
  const [guessDisabled, setGuessDisabled] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const [gpsData, setGpsData] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    /**
     * Loads the JSON data for the game based on the mode parameter passed
     * in the URL. If the mode is not recognized, it defaults to the Europe
     * mode.
     *
     * @returns {Promise<void>} A promise that resolves when the data is loaded.
     */
    const loadJsonData = async () => {
      try {
        let data;
        if (mode === "0") {
          data = await import("@/app/europe.json");
        } else if (mode === "1") {
          data = await import("@/app/americas.json");
        } else if (mode === "2") {
          data = await import("@/app/asiaoce.json");
        } else if (mode === "3") {
          data = await import("@/app/africame.json");
        } else {
          data = await import("@/app/europe.json");
        }
        setGpsData(data.default);
      } catch (error) {
        console.error("Error loading JSON data", error.message);
      }
    };

    loadJsonData();
  }, []);

  /**
   * Verifies the user's guess by calculating the distance between the clicked spherical coordinates
   * and the actual location's coordinates. Updates the score based on the distance and displays
   * the result in a modal.
   *
   * @param {Object} location - The location object containing latitude and longitude.
   * @param {THREE.Spherical} clickedSphericalCoords - The spherical coordinates of the clicked point.
   */
  const verifyGuess = (location, clickedSphericalCoords) => {
    if (clickedSphericalCoords) {
      const middlePointGPS = {
        latitude: location.latitude,
        longitude: location.longitude,
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

      // Add tolerance: if distance is less than 10km, set score to 1000
      let newScore =
        fixedDistance < 20
          ? 1000
          : Math.max(
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

  /**
   * Handles the logic when the user wants to view the next image. This means
   * incrementing the current index, closing the modal, resetting the actual
   * location and the clicked spherical coordinates, and re-enabling the
   * guess button. If the current index is at the last image, it will also
   * set the game over flag to true.
   */
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

  /**
   * Handles the logic when the user wants to take a guess. This means checking
   * if the guess button is enabled, and if so, calling the verifyGuess function
   * with the current image and the clicked spherical coordinates. Afterwards,
   * the guess button is disabled and the clicked spherical coordinates are
   * reset.
   */
  const handleGuessButtonClick = () => {
    if (!guessDisabled) {
      verifyGuess(
        gpsData.gpsImageData[Object.keys(gpsData.gpsImageData)[currentIndex]],
        clickedSphericalCoords
      );
      setGuessDisabled(true);
    }
    setClickedSphericalCoords(null);
  };

  return gpsData ? (
    <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
      <div className="flex flex-col items-center justify-center space-y-4">
        {currentIndex < Object.keys(gpsData.gpsImageData).length ? (
          <QuestionImage
            location={Object.keys(gpsData.gpsImageData)[currentIndex]}
            onGuessButtonClick={handleGuessButtonClick}
            clickedSphericalCoords={clickedSphericalCoords}
            guessDisabled={guessDisabled}
            gpsData={gpsData}
          />
        ) : null}
      </div>
      <div className="fixed bottom-10 right-10 z-50">
        {actualLocation ? (
          <button
            onClick={handleNextImage}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            {currentIndex + 1 === Object.keys(gpsData.gpsImageData).length
              ? t("game.showResults")
              : t("game.nextImage")}
          </button>
        ) : null}
      </div>

      <div className="fixed top-16 left-2 px-1 py-2 text-center min-w-10 rounded-md text-xl z-50 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        <p className="hidden sm:block">
          {t("game.currentScore")} {score}
        </p>
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
          mode={mode}
        />
      ) : null}

      <div className="mt-14">
        <Canvas style={{ width: "100vw", height: "100vh" }}>
          <StarField />
          <OrbitControlsCustom />
          <ambientLight intensity={2} />
          <directionalLight intensity={1} position={[2, 1, 1]} />
          <Earth
            setClickedSphericalCoords={setClickedSphericalCoords}
            clickedSphericalCoords={clickedSphericalCoords}
            actualLocation={actualLocation}
            gpsData={gpsData}
            currentIndex={currentIndex}
          />
        </Canvas>
      </div>
    </div>
  ) : (
    <p>{t("game.loadingData")}</p>
  );
};

/**
 * StarField component renders a starfield background using Three.js
 * points material and buffer geometry. The stars are positioned randomly
 * within a cube of size 200x200x200 centered at the origin. The colors of
 * the stars are randomly generated around white, blue, yellow, orange, and
 * red. The component renders the stars as points using the points
 * material and buffer geometry.
 *
 * @returns {JSX.Element} The rendered starfield component.
 */
const StarField = () => {
  const points = useMemo(() => {
    const starCount = 500;
    const stars = [];
    const colors = [];

    for (let i = 0; i < starCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(200);
      const y = THREE.MathUtils.randFloatSpread(200);
      const z = THREE.MathUtils.randFloatSpread(200);
      stars.push(x, y, z);

      // random colors around white, blue, yellow, orange, red
      const color = new THREE.Color();
      color.setHSL(Math.random(), Math.random(), Math.random());
      colors.push(color.r, color.g, color.b);
    }

    return {
      positions: new Float32Array(stars),
      colors: new Float32Array(colors),
    };
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={points.positions}
          count={points.positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={points.colors}
          count={points.colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.3} vertexColors={true} />{" "}
    </points>
  );
};

/**
 * Custom OrbitControls component that provides enhanced camera control
 * features for a 3D scene using react-three-fiber.
 *
 * This component sets up a reference to the OrbitControls and configures
 * various options such as damping, zoom, rotation speed, and distance
 * constraints for the camera. It also updates the controls on each frame
 * to ensure smooth interactions.
 *
 * The controls are set to enable damping with a specific damping factor
 * and allow zooming and rotation while disabling panning. The camera's
 * distance to the target is constrained between a minimum and maximum
 * value to maintain a consistent viewing experience.
 *
 * @returns {ReactElement} The OrbitControlsCustom component.
 */

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

    controlsRef.current.minDistance = 1.11; // Minimum distance from the camera to the target
    controlsRef.current.maxDistance = 2; // Maximum distance from the camera to the target
  }, []);

  useFrame(() => {
    controlsRef.current.update();
  });

  return <OrbitControls ref={controlsRef} args={[camera]} />;
};

/**
 * Renders an interactive image component where users can make guesses
 * about the image location. The component allows zooming and modal
 * view for detailed inspection of the image.
 *
 * @param {string} location - The key representing the image location in gpsData.
 * @param {function} onGuessButtonClick - Callback function triggered when the guess button is clicked.
 * @param {THREE.Spherical} clickedSphericalCoords - Coordinates of the user's current guess.
 * @param {boolean} guessDisabled - Flag to determine if the guess button is disabled.
 * @param {Object} gpsData - Contains GPS image data including paths and locations.
 *
 * @returns {JSX.Element|null} The rendered interactive image component or null if data is missing.
 */
const QuestionImage = ({
  location,
  onGuessButtonClick,
  clickedSphericalCoords,
  guessDisabled,
  gpsData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1); // State to track zoom level
  const modalImageRef = useRef(null);
  const { t } = useLanguage();

  const data = gpsData.gpsImageData[location];

  if (!data) {
    return null;
  }

  /**
   * Handles mouse wheel events. Prevents default scrolling, and instead zooms
   * the image in or out based on the wheel direction.
   * @param {WheelEvent} e The mouse wheel event.
   */
  const handleWheel = (e) => {
    e.preventDefault(); // Prevent default scrolling
    const delta = e.deltaY > 0 ? -0.1 : 0.1; // Determine zoom direction
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.5), 3)); // Limit zoom range between 0.5x and 3x
  };

  /**
   * Handles a click on the background, and checks if the click is outside of
   * the image bounds. If it is, the modal is closed.
   * @param {MouseEvent} e The mouse event.
   */
  const handleBackgroundClick = (e) => {
    if (!modalImageRef.current) return;

    const rect = modalImageRef.current.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Check if click is outside the image bounds
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsModalOpen(false); // Close the modal
    }
  };

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
        {t("game.guessButton")}
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20"
          onClick={handleBackgroundClick} // Close modal if clicking outside bounds
        >
          <div
            className="relative"
            onWheel={handleWheel} // Attach wheel event
          >
            <Image
              ref={modalImageRef}
              src={data.img_path}
              alt={data.location}
              width={1000}
              height={1000}
              className="w-auto h-auto"
              priority={true}
              quality={100}
              unoptimized
              style={{ transform: `scale(${scale})` }} // Apply zoom transformation
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * A 3D Earth component that displays a textured sphere with a marker for the
 * user's guessed location and the actual location. The component also renders a
 * yellow line connecting the two points if the guessed location is within a
 * certain distance of the actual location. The component is interactive, and
 * responds to mouse clicks and double clicks to update the marker position.
 *
 * @param {Object} props - The component props.
 * @param {function} props.setClickedSphericalCoords - A function to update the
 *   app state with the user's guessed location in spherical coordinates.
 * @param {THREE.Spherical} props.clickedSphericalCoords - The user's current
 *   guessed location in spherical coordinates.
 * @param {Object} props.actualLocation - The actual location of the image.
 * @param {Object} props.gpsData - The GPS data for the images.
 * @param {number} props.currentIndex - The current index of the image being
 *   displayed.
 */
const Earth = ({
  setClickedSphericalCoords,
  clickedSphericalCoords,
  actualLocation,
  gpsData,
  currentIndex,
}) => {
  const mesh = useRef();
  const { camera, gl } = useThree();
  const [markerPosition, setMarkerPosition] = useState(null);

  const texture = useMemo(() => {
    const textureLoader = new THREE.TextureLoader();
    const tex = textureLoader.load(earthTexture.src);
    tex.wrapS = THREE.RepeatWrapping;
    tex.offset.x = 0.2502;
    tex.offset.y = 0.0006;
    return tex;
  }, []);

  const texMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({ map: texture });
  }, [texture]);

  /**
   * Handles a click on the canvas, and calculates the spherical coordinates of
   * the intersection point on the Earth mesh.
   *
   * @param {MouseEvent} event The mouse event.
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
      setClickedSphericalCoords(
        new THREE.Spherical().setFromVector3(intersection.point)
      );
      setMarkerPosition(intersection.point);
    }
  };

  /**
   * Creates a smooth curve between two 3D points using Catmull-Rom splines.
   *
   * @param {THREE.Vector3} point1 - The starting point of the curve.
   * @param {THREE.Vector3} point2 - The ending point of the curve.
   * @returns {THREE.Vector3[]} An array of Vector3 points representing the curve.
   */
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

  /**
   * Interpolates between two 3D points by linearly interpolating between the
   * two points, normalizing the result, and scaling it to have length 1.
   *
   * @param {THREE.Vector3} point1 - The starting point of the interpolation.
   * @param {THREE.Vector3} point2 - The ending point of the interpolation.
   * @param {number} numPoints - The number of points to interpolate.
   * @returns {THREE.Vector3[]} An array of Vector3 points representing the interpolation.
   */
  const interpolatePoints = (point1, point2, numPoints) => {
    const points = [];
    for (let i = 1; i < numPoints; i++) {
      const alpha = i / numPoints;
      const interpolated = new THREE.Vector3()
        .copy(point1)
        .lerp(point2, alpha)
        .normalize()
        .multiplyScalar(1);
      points.push(interpolated);
    }
    return points;
  };

  // Reset markerPosition when currentIndex changes
  useEffect(() => {
    setMarkerPosition(null);
  }, [currentIndex]);

  return (
    <mesh
      ref={mesh}
      scale={[1, 1, 1]}
      onDoubleClick={!isMobile ? handleCanvasClick : null}
      onClick={isMobile ? handleCanvasClick : null}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <primitive object={texMaterial} attach="material" />

      {markerPosition ? (
        <mesh position={markerPosition}>
          <sphereGeometry args={[0.003, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ) : null}

      {actualLocation ? (
        <mesh position={new THREE.Vector3().setFromSpherical(actualLocation)}>
          <sphereGeometry args={[0.003, 16, 16]} />
          <meshBasicMaterial color="green" />
        </mesh>
      ) : null}

      {markerPosition && actualLocation ? (
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geometry) => {
              const curvePoints = createCurveBetweenPoints(
                markerPosition,
                new THREE.Vector3().setFromSpherical(actualLocation)
              );
              const positions = new Float32Array(
                curvePoints.flatMap((point) => [point.x, point.y, point.z])
              );
              geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
              );
            }}
          />
          <lineBasicMaterial attach="material" color="yellow" linewidth={3} />
        </line>
      ) : null}
    </mesh>
  );
};

/**
 * A modal component that displays the result of the user's guess.
 *
 * @param {string} location - The name of the location.
 * @param {number} distance - The distance between the user's guess and the actual location in kilometers.
 * @param {number} points - The points earned by the user based on the distance.
 * @param {function} onClose - The callback function that is called when the user closes the modal.
 * @returns {JSX.Element} The modal component.
 */
const Modal = ({ location, distance, points, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useLanguage();

  /**
   * Closes the modal by setting its open state to false and calls the onClose callback.
   */
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
              {t("game.modal.location").replace("{location}", location)}
            </p>
            <p className="text-lg text-gray-950 font-semibold">
              {t("game.modal.distance").replace("{distance}", distance)}
            </p>
            {/* <p className="text-lg text-gray-950 font-semibold">
                            Your guess is {d} km away (Haversine)
                        </p> */}
            <p className="text-lg text-green-600 font-semibold">
              {t("game.modal.points").replace("{points}", points)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * The EndGameModal component renders a modal dialog that appears after the
 * user has finished playing the game. The modal displays the total score
 * the user achieved, a grid of images representing the locations visited
 * during the game, and a button to try again or go back to the home page.
 *
 * @param {Object} gpsImageData - An object containing the image data for each
 * location visited during the game.
 * @param {number[]} distances - An array of distances, where each distance is
 * the distance from the user's guess to the actual location.
 * @param {number} totalScore - The total score the user achieved during the game.
 * @param {function} onClose - A callback function to call when the modal is
 * closed.
 * @param {number} mode - The mode of the game that was played.
 * @returns {JSX.Element} The rendered EndGameModal component.
 */
const EndGameModal = ({
  gpsImageData,
  distances,
  totalScore,
  onClose,
  mode,
}) => {
  const { t } = useLanguage();

  /**
   * Reloads the page to start a new game.
   * @returns {void}
   */
  const handleTryAgain = () => {
    window.location.reload();
  };

  /**
   * Updates the user's max score for the given mode by sending a POST request
   * to /api/users/updateMaxScore with the totalScore and mode.
   *
   * @param {number} totalScore - The total score to update.
   *
   * @returns {Promise<void>} - A promise that resolves if the update is successful and
   * rejects if there's an error.
   */
  const updateMaxScore = async (totalScore) => {
    try {
      const response = await axios.post(
        "/api/users/updateMaxScore",
        {
          totalScore,
          mode,
        },
        {
          withCredentials: true,
        }
      );
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

  /**
   * Determines the color class based on the distance.
   *
   * @param {number} distance - The distance value to evaluate.
   * @returns {string} - The CSS class representing the color, which indicates how close the distance is.
   *                     Returns green for distances under 100, yellow for distances under 500, and red otherwise.
   */
  const getDistanceColor = (distance) => {
    if (distance < 100) return "bg-green-100 text-green-800";
    if (distance < 500) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div style={{ position: "fixed", zIndex: 9999 }}>
      <div className="modal-background fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="modal-content bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-screen overflow-y-auto p-4 relative">
          <h1 className="text-xl md:text-2xl text-gray-950 font-semibold mb-2 text-center">
            {t("game.endGame.title")}
          </h1>
          <p className="text-base md:text-lg text-gray-950 font-semibold mb-2 text-center">
            {t("game.endGame.totalScore").replace("{score}", totalScore)}
          </p>
          <div className="mt-2 mb-4">
            <h2 className="text-lg text-gray-950 font-semibold mb-2 text-center">
              {t("game.endGame.results")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.keys(gpsImageData).map((key, index) => {
                const colorClass = getDistanceColor(distances[index]);
                return (
                  <div
                    key={index}
                    className={`p-2 rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${colorClass}`}
                  >
                    <Image
                      src={gpsImageData[key].img_path}
                      alt={gpsImageData[key].location}
                      width={300}
                      height={200}
                      className="rounded-md mb-1 w-full"
                    />
                    <p className="font-medium text-center text-sm">
                      {gpsImageData[key].location}
                    </p>
                    <p className="text-center text-sm">
                      {t("game.endGame.distance")}
                      <span className="font-semibold">
                        {distances[index].toFixed(0)} km
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2 mt-4">
            <button
              onClick={handleTryAgain}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {t("game.endGame.tryAgain")}
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {t("game.endGame.home")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
