import morgan from "morgan";
import logger from "./logger.js";

// Custom token (example): display userId from JWT middleware
morgan.token("user", (req) => (req.user ? req.user._id : "guest"));

// Morgan format
const morganFormat = ":method :url :status :response-time ms - user::user";

const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default morganMiddleware;
