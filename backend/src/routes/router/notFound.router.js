import STATUS from "../../utils/http.status.text.js";

const notFound = (req, res) => {
  res.status(404).json({
    status: STATUS.FAIL,
    message: "Route not found",
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
};

export default notFound;
