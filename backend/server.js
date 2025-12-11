import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import xss from "xss-clean";
import compression from "compression";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import path from "path";

import morganMiddleware from "./src/middlewares/morgan.js";
import mainRouters from "./src/routes/index.router.js";

// Load env first
dotenv.config({ path: ".env" });

// Connect DB
import "./src/config/database.js";

// Create express app
const app = express();

// CORS for prevent cross-origin attack
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Cookies
  })
);

const __dirname = path.resolve();

// Middlewares
app.use(express.json({ limit: "50mb" })); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For parsing cookies in requests
app.use(morganMiddleware); // For logging

// // Security Middleware
// app.use(helmet()); // Set security HTTP headers
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(hpp());
// app.use(xss());

// app.use(compression()); // Compress responses for better performance

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 دقيقة
//   max: 100, // 100 request لكل IP
//   message: "Too many requests from this IP, please try again after 15 minutes",
// });
// app.use(limiter);

// // Slow down
// const speedLimiter = slowDown({
//   windowMs: 15 * 60 * 1000,
//   delayAfter: 50,
//   delayMs: () => 500,
// });

// app.use(speedLimiter);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mainRouters(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
