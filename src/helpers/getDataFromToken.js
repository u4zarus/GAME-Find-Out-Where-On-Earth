import jwt from "jsonwebtoken";

/**
 * Retrieves the user ID from the request cookies.
 *
 * @param {Request} request - The incoming request object.
 * @returns {string} - The user ID if the token is valid, otherwise throws an error.
 * @throws {Error} - If the token is invalid or missing.
 */
export function getDataFromToken(request) {
    try {
        const token = request.cookies.get("token")?.value || "";
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        return decodedToken.id;
    } catch (error) {
        throw new Error(error.message);
    }
}
