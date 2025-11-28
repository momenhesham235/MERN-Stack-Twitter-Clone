import STATUS from "../utils/http.status.text.js";

const globalError = (error, req, res, next) => {
  res.status(error.httpStatusCode || 500).send({
    status: error.StatusText || STATUS.ERROR,
    error: error.message,
    code: error.httpStatusCode || 500,
    stack: process.env.NODE_ENV === "production" ? null : error.stack, // for debugging  => get path of error
  });
};

export default globalError;
