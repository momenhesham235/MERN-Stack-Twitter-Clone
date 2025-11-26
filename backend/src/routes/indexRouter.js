import authRoutes from "./router/auth.router.js";
import userRoutes from "./router/user.router.js";
import notFound from "./router/notFound.router.js";
import globalError from "../utils/globalError.js";

 const mainRouters = (app) => {

    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);

    // Handle 404 - Not Found
    app.use(notFound);

    // Global Error Handling Middleware
    app.use(globalError);
}

export default mainRouters;

