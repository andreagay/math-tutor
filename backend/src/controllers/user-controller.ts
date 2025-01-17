/**
 * User Controller
 *
 * Handles all user-related operations including:
 * - User authentication (login, signup)
 * - User verification
 * - User retrieval
 *
 * This controller implements secure password handling using bcrypt
 * and manages authentication via JWT tokens stored in cookies.
 *
 * @module controllers/user-controller
 */

import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME, COOKIE_EXPIRES } from "../utils/constants.js";
import { NextFunction, Request, Response } from "express";

const cookieOptions = {
  httpOnly: true,
  domain: process.env.DOMAIN,
  signed: true,
  path: "/",
  sameSite: "none",
  secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production
};

/**
 * Retrieves all users from the database
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} JSON response with users array
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};

/**
 * Creates a new user account and handles authentication
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} JSON response with user details
 */
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract user details from request body
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Clear any existing authentication cookies
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production);
    });

    // Generate new authentication token and set cookie
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production
      expires,
    });

    // Return success response with user details
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};

/**
 * Authenticates existing user credentials
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} JSON response with user details
 */
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract login credentials
    const { email, password } = req.body;

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Clear existing authentication
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production
    });

    // Set new authentication token
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production
      expires,
    });

    // Return success response
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};

/**
 * Verifies user authentication and token validity
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} JSON response with user details
 */
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //DEBUGGER: check cookies
    console.log("Cookies in verifyUser:", req.cookies);
    console.log("Signed Cookies in verifyUser:", req.signedCookies);
    console.log("JWT Token in verifyUser:", req.signedCookies[COOKIE_NAME]);

    // Find user by ID from JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found OR token expired" });
    }

    // Verify user ID matches token
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permission did not match" });
    }

    // Return success response
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};

/**
 * Verifies user authentication and token validity
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<Response>} JSON response with user details
 */
export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find user by ID from JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found OR token expired" });
    }

    // Verify user ID matches token
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permission did not match" });
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: process.env.DOMAIN,
      signed: true,
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production", //verify use of HTTPS if in production
    });

    // Return success response
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};
