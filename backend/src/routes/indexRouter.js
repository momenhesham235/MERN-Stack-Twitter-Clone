import authRoutes from "./router/auth.router.js";
import notFound from "./router/notFound.router.js";

 const mainRouters = (app) => {

    app.use("/api/auth", authRoutes);

    // Handle 404 - Not Found
    app.use(notFound);
}

export default mainRouters;

