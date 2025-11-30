import STATUS from "../utils/http.status.text.js";
import logger from "../middlewares/logger.js";

const globalError = (error, req, res, next) => {
  // سجل الخطأ في ملف اللوج مع تفاصيل الـ request
  logger.error({
    message: error.message,
    method: req.method,
    url: req.originalUrl,
    user: req.user?._id || "guest",
    stack: error.stack,
    code: error.httpStatusCode || 500,
  });

  res.status(error.httpStatusCode || 500).send({
    status: error.StatusText || STATUS.ERROR,
    error: error.message,
    code: error.httpStatusCode || 500,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

export default globalError;
