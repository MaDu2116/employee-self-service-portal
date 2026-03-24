import winston from 'winston';
import { CONFIG } from './constants';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: CONFIG.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'ess-portal' },
  transports: [
    new winston.transports.Console({
      format: CONFIG.NODE_ENV === 'production'
        ? logFormat
        : winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});
