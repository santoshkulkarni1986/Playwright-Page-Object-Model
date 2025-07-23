/***Author 
 * Santosh Kulkarni
 */
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info', // Default log level for general messages
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    // Console transport for all levels
    new transports.Console(),

    // File transport for all logs (info, error, etc.)
    new transports.File({ filename: 'logs/app.log' }),

    // Separate file transport specifically for errors
    new transports.File({
      filename: 'logs/error.log',
      level: 'error', // This transport will only log errors
    }),
  ],
});

// Log uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new transports.File({ filename: 'logs/exceptions.log' })
);

logger.rejections.handle(
  new transports.File({ filename: 'logs/rejections.log' })
);

logger.rejections.handle(
  new transports.File({ filename: 'logs/rejections.log' })
);

export function options(scenarioName: string) {
  return {
    transports: [
      new transports.File({
        filename: `test-results/logs/${scenarioName}/log.log`,
        level: 'info',
      }),
    ],
  };
}
export default logger;
