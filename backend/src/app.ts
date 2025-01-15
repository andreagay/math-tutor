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
    origin: allowedOrigins,
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

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Body parser
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//Routes
app.use("/api/v1", appRouter);

export default app;
