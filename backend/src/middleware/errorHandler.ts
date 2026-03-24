import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { CONFIG } from '../config/constants';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Unhandled error', {
    name: err.name,
    message: err.message,
    stack: CONFIG.NODE_ENV === 'development' ? err.stack : undefined,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
  });
};
