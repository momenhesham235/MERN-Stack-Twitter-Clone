import { Router } from "express";
import { signup, login, logout , getMe } from "../../controllers/auth.controller.js";
import protectRoute  from "../../middlewares/protectRoute.js";

export const authRoutes = Router();

// Define your authentication routes here
authRoutes.get("/me", protectRoute, getMe);

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

export default authRoutes;