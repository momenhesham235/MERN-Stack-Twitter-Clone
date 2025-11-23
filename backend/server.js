import express from 'express';
import dotenv from "dotenv";

// Load env first
dotenv.config({ path: "backend/src/config/.env" });

// Connect DB
import './src/config/database.js';

import mainRouters from './src/routes/index.js';

const app = express();
app.use(express.json());

mainRouters(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
