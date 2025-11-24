import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import STATUS from "../utils/httpStatusText.js";

 const protectRoute = async (req, res, next) => {

    try {
        let token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ status: STATUS.UNAUTHORIZED, message: "Not authorized, no token found" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ status: STATUS.UNAUTHORIZED, message: "Not authorized, token is invalid" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ status: STATUS.UNAUTHORIZED, message: "Not authorized, user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({ status: STATUS.ERROR, message: "Server Error" });

    }
}

export default protectRoute;