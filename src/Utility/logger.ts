/***Author
 * Santosh Kulkarni
 */
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),

    new transports.File({ filename: 'test-results/logs/app.log' }),

    new transports.File({
      filename: 'test-results/logs/error.log',
      level: 'error',
    }),
  ],
});

// Log uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new transports.File({ filename: 'test-results/logs/exceptions.log' }),
);

logger.rejections.handle(
  new transports.File({ filename: 'test-results/logs/rejections.log' }),
);

logger.rejections.handle(
  new transports.File({ filename: 'test-results/logs/rejections.log' }),
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
