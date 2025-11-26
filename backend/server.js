import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import mainRouters from './src/routes/indexRouter.js';
import { v2 as cloudinary } from 'cloudinary';

// Load env first
dotenv.config({ path: "backend/src/config/.env" });

// Connect DB
import './src/config/database.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cookieParser()); // For parsing cookies in requests 


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
