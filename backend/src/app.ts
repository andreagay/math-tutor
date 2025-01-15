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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

//Security
app.use(helmet());

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
