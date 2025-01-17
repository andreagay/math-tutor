import express from "express";
import path from "path";
import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Connection and listeners
const PORT = process.env.PORT || 4000;
// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
    // Serve static frontend files
    const frontendBuildPath = path.join(__dirname, "../../frontend/dist");
    app.use(express.static(frontendBuildPath));
    // Handle React routing, return all requests to React app
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
    });
}
connectToDatabase()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    process.exit(1);
});
/**
 *const path = require("path");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

*/
//# sourceMappingURL=index.js.map