import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connection and listeners
const PORT = process.env.PORT || 4000;

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend build directory
  const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendBuildPath));

  // Handle client-side routing by serving index.html for all routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
