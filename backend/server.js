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

import morganMiddleware from "./src/middlewares/morgan.js";
import mainRouters from "./src/routes/index.router.js";

// Load env first
dotenv.config({ path: "backend/src/config/.env" });

// Connect DB
import "./src/config/database.js";

// Create express app
const app = express();

// Middlewares
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For parsing cookies in requests
app.use(morganMiddleware); // For logging

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp());
app.use(xss());
// CORS for prevent cross-origin attack
app.use(cors());
// app.options(cors());
app.use(compression()); // Compress responses for better performance

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 request لكل IP
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Slow down
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
});

app.use(speedLimiter);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mainRouters(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
