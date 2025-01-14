import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { validate } from "../utils/validators.js";
import { chatCompletionValidator } from "../utils/validators.js";
import {
  generateChatCompletion,
  sendChatHistory,
  clearChatHistory,
} from "../controllers/chat-controller.js";

const chatRoutes = Router();

chatRoutes.post(
  "/new",
  validate(chatCompletionValidator),
  verifyToken,
  generateChatCompletion
);

chatRoutes.get("/all-chats", verifyToken, sendChatHistory);
chatRoutes.delete("/delete", verifyToken, clearChatHistory);

export default chatRoutes;
