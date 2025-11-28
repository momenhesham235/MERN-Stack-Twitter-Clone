import { Router } from "express";
import protectRoute from "../../middlewares/protect.route.js";
import {
  getAllPosts,
  getSinglePost,
  createPost,
  deletePost,
  likeOrUnlikePost,
  getPostCount,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} from "../../controllers/post.controller.js";
import validationObjectID from "../../middlewares/validationObjectID.js";

const postRoutes = Router();

// Define your post-related routes here
postRoutes.get("/all", protectRoute, getAllPosts);
postRoutes.get("/following", protectRoute, getFollowingPosts);
postRoutes.get("/count", protectRoute, getPostCount);
postRoutes.get("/user/:username", protectRoute, getUserPosts);
postRoutes.get("/liked/:id", protectRoute, validationObjectID, getLikedPosts);

postRoutes.post("/create", protectRoute, createPost);
postRoutes.post(
  "/like/:id",
  validationObjectID,
  protectRoute,
  likeOrUnlikePost
);

postRoutes
  .route("/:id")
  .get(protectRoute, validationObjectID, getSinglePost)
  .delete(protectRoute, validationObjectID, deletePost);

export default postRoutes;
