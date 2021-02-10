const winston = require('winston');

const formats = winston.format.combine(winston.format.colorize(), winston.format.json());
winston.addColors({
  silly: 'magenta',
  debug: 'blue',
  verbose: 'cyan',
  info: 'green',
  warn: 'yellow',
  error: 'red',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: './logs/errors.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/allLogs.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: './logs/rejections.log' }),
  ],
});

logger.add(new winston.transports.Console({
  format: winston.format.simple(),
  level: 'info',
  prettyPrint: true,
  colorize: true,
  silent: false,
  timestamp: false,
}));
logger.exitOnError = true;

module.exports = logger;
