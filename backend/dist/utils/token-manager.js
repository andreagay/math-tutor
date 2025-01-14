import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
/**
 * Creates a JWT token with user credentials
 * @param {string} id - The user's unique identifier
 * @param {string} email - The user's email address
 * @param {string} expiresIn - Token expiration time (e.g., '1h', '7d')
 * @returns {string} The generated JWT token
 */
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
};
/**
 * Middleware to verify JWT token from signed cookies
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} Promise that resolves when token is verified
 */
export const verifyToken = async (req, res, next) => {
    // Extract token from signed cookies
    const token = req.signedCookies[`${COOKIE_NAME}`];
    // Check if token exists and is not empty
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token not received" });
    }
    // Verify the token using Promise wrapper
    return new Promise((resolve, reject) => {
        return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                // Handle token verification failure
                reject(err.message);
                return res.status(401).json({ message: "Token expired" });
            }
            else {
                // On successful verification
                console.log("Verified token successfully");
                resolve();
                // Store decoded token data in res.locals for downstream middleware
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};
//# sourceMappingURL=token-manager.js.map