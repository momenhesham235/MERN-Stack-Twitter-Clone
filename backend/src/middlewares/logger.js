import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDir = path.join(process.cwd(), "backend/src/logs");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: `${logDir}/access-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),

    new transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
    }),

    new transports.File({
      filename: `${logDir}/combined.log`,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
