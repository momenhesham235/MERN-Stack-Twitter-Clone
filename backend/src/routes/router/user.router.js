import { Router } from "express";
import { getUserProfile , followOrUnfollowUser ,
 getSuggestedUsers , updateUserProfile  } from "../../controllers/user.controller.js";
import protectRoute from "../../middlewares/protectRoute.js";
import validationObjectID from "../../middlewares/validationObjectID.js";


export const userRoutes = Router();

// Define your user-related routes here
userRoutes.get("/profile/:username", protectRoute, getUserProfile);
userRoutes.post("/follow/:id", validationObjectID , protectRoute, followOrUnfollowUser);
userRoutes.get("/suggested", protectRoute, getSuggestedUsers);
userRoutes.patch("/update", protectRoute, updateUserProfile);

export default userRoutes;