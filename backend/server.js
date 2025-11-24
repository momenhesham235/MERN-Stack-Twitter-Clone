import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import mainRouters from './src/routes/indexRouter.js';

// Load env first
dotenv.config({ path: "backend/src/config/.env" });

// Connect DB
import './src/config/database.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


mainRouters(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
