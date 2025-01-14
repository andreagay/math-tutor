import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import openai, { OpenAI } from "openai";

/**
 * Generates a chat completion using OpenAI's API
 * @param {Request} req - Express request object containing the message in the body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function middleware
 * @returns {Promise<Response>} JSON response with updated chat history or error
 */
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Extract message from request body
  const { message } = req.body;
  try {
    // Find user by ID stored in JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Format existing chats into OpenAI-compatible format
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
    })) as openai.ChatCompletionMessageParam[];

    // Add new user message to chat arrays
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Initialize OpenAI client with API key
    const openaiClient = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET });

    // Request completion from OpenAI API
    const chatResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chats,
    });

    // Save AI response to user's chat history
    user.chats.push(chatResponse.choices[0].message);
    await user.save();

    // Return updated chat history
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendChatHistory = async (req, res, next) => {
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

    // Return success response
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};

export const clearChatHistory = async (req, res, next) => {
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
    // @ts-ignore
    // Clear chat history
    user.chats = [];
    await user.save();

    // Return success response
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message, cause: error.message });
  }
};
