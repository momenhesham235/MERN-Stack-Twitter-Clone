import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

// مسار مجلد الـ logs
const logDir = path.join(process.cwd(), "backend/src/logs");

// إنشاء فولدرات لكل نوع لو مش موجودة
["info", "error", "combined"].forEach((folder) => {
  const folderPath = path.join(logDir, folder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
});

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    // Info logs
    new DailyRotateFile({
      filename: path.join(logDir, "info", "info-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "info",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),

    // Error logs
    new DailyRotateFile({
      filename: path.join(logDir, "error", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),

    // Combined logs
    new DailyRotateFile({
      filename: path.join(logDir, "combined", "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

// Console أثناء التطوير
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
