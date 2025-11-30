import authRoutes from "./router/auth.router.js";
import userRoutes from "./router/user.router.js";
import postRoutes from "./router/post.router.js";
import commentRoutes from "./router/comment.router.js";
import notificationRoutes from "./router/notification.router.js";
import notFound from "./router/notFound.router.js";
import globalError from "../middlewares/global.error.js";

const mainRouters = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/comments", commentRoutes);
  app.use("/api/notifications", notificationRoutes);

  // Handle 404 - Not Found
  app.use(notFound);

  // Global Error Handling Middleware
  app.use(globalError);
};

export default mainRouters;
