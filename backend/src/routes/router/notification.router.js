import { Router } from "express";
import protectRoute from "../../middlewares/protect.route.js";
import {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} from "../../controllers/notification.controller.js";

import validationObjectID from "../../middlewares/validationObjectID.js";

const notificationRoutes = Router();

// Define your notification-related routes here
notificationRoutes
  .route("/")
  .get(protectRoute, getNotifications)
  .delete(protectRoute, deleteNotifications);

notificationRoutes.delete(
  "/:id",
  protectRoute,
  validationObjectID,
  deleteNotification
);

export default notificationRoutes;
