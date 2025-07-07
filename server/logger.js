const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define the log file path
const logFilePath = path.join(logDir, "application.log");

// Create the logger
const logger = createLogger({
  level: "info", // Logs all levels above "info" (info, warn, error)
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    // Console transport for development
    new transports.Console(),
    // File transport for logging all levels
    new transports.File({ filename: logFilePath }),
  ],
});

// Dynamic import to resolve circular dependency
let broadcastNotification;
try {
  const websocketModule = require("../server/Utils/websocket");
  broadcastNotification = websocketModule.broadcastNotification;
} catch (error) {
  console.error("Error importing websocketServer:", error.message);
}

// Function to log and optionally broadcast messages
function logWithOptionalBroadcast(level, message, send = false) {
  logger.log({ level, message });
  if (send === true && typeof broadcastNotification === "function") {
    broadcastNotification(message);
  }
}

module.exports = { logWithOptionalBroadcast };
