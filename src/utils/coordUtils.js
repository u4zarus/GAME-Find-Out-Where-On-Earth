import * as THREE from "three";

/**
 * Calculates the distance between two points on the Earth's surface given their
 * spherical coordinates, using Vincenty's formula.
 *
 * @param {THREE.Spherical} sphericalCoord1 - The spherical coordinates of the first point.
 * @param {THREE.Spherical} sphericalCoord2 - The spherical coordinates of the second point.
 * @returns {number} The distance between the two points in meters.
 */
export const calculateDistance2 = (sphericalCoord1, sphericalCoord2) => {
    const coord1 = sphericalToGeographic(sphericalCoord1);
    const coord2 = sphericalToGeographic(sphericalCoord2);

    return vincentysFormula(coord1, coord2);
};

/**
 * Converts spherical coordinates to geographic coordinates.
 *
 * @param {THREE.Spherical} sphericalCoord - The spherical coordinates to convert.
 * @returns {Object} An object containing the latitude and longitude in degrees.
 */
export const sphericalToGeographic = (sphericalCoord) => {
    const latitude = 90 - THREE.MathUtils.RAD2DEG * sphericalCoord.phi;
    const longitude = THREE.MathUtils.RAD2DEG * sphericalCoord.theta;

    return { latitude, longitude };
};

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Calculates the distance between two points on the Earth's surface given their
 * geographic coordinates, using Vincenty's formula.
 *
 * @param {Object} coord1 - The geographic coordinates of the first point.
 * @param {Object} coord2 - The geographic coordinates of the second point.
 *
 * @returns {number} The distance between the two points in kilometers.
 * @throws {Error} If the formula fails to converge within the maximum number of iterations.
 * @throws {Error} If the coordinates are invalid.
 */
export const vincentysFormula = (coord1, coord2) => {
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
};
