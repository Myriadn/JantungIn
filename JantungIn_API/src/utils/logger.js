'use strict';

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create production logger
const productionLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'jantungin-api' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

// Create development logger with console output
const developmentLogger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
    )
  ),
  transports: [new winston.transports.Console()],
});

// Choose logger based on environment
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

// Add stream for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Add request logging middleware
const requestLogger = (req, res, next) => {
  // Skip logging for health checks and static resources
  if (req.path === '/health' || req.path.startsWith('/public/')) {
    return next();
  }

  logger.info(`${req.method} ${req.path} ${req.ip}`);
  next();
};

module.exports = {
  logger,
  requestLogger,
};
