import authRoutes from "./router/auth.router.js";


 const mainRouters = (app) => {

    app.use("/api/auth", authRoutes);

}


export default mainRouters;

