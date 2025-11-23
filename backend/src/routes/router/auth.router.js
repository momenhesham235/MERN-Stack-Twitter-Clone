import { Router } from "express";
import { signup, login, logout } from "../../controllers/auth.controller.js";

export const authRoutes = Router();

// Define your authentication routes here
authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;