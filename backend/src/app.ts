import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import appRouter from "./routes/index.js";
import helmet from "helmet";
config();

const app = express();

//Middleware

//CORS
const allowedOrigins = [
  "https://tutormatematica.me",
  "https://www.tutormatematica.me",
  "https://tutormatematica.me/api/v1",
  "https://www.tutormatematica.me/api/v1",
  "http://tutormatematica.me",
  "http://www.tutormatematica.me",
  "http://tutormatematica.me/api/v1",
  "http://www.tutormatematica.me/api/v1",
  "https://tutormatematica.me/api/v1/users/auth-status",
  process.env.FRONTEND_URL || "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

//Security
// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://tutormatematica.me",
          "https://www.tutormatematica.me",
          "https://tutormatematica.me/api/v1",
          process.env.FRONTEND_URL || "http://localhost:5173",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy:
        process.env.NODE_ENV === "production" ? "same-site" : "cross-origin",
    },
  })
);

//Body parser
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Routes
app.use("/api/v1", appRouter);

export default app;

/** 


// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Create Express application
const app = express();

// Middleware
// CORS configuration
const allowedOrigins = [
  "https://www.notthesme.com",
  "https://notthesme.com",
  "http://localhost:3000", // Keep this for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());


mongoose
  .connect(
    process.env.MONGODB_URI.replace("<db_password>", process.env.MONGODB_PWD)
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/chat", chatRoutes);


*/
