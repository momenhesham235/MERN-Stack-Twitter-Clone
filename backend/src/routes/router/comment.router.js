import { Router } from "express";
import protectRoute from "../../middlewares/protect.route.js";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../../controllers/comment.controller.js";
import validationObjectID from "../../middlewares/validationObjectID.js";

const commentRoutes = Router();

commentRoutes.post("/", protectRoute, createComment);

commentRoutes
  .route("/:id")
  .delete(protectRoute, validationObjectID, deleteComment)
  .patch(protectRoute, validationObjectID, updateComment);

export default commentRoutes;
