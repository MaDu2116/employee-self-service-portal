import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from '../types';
import { AppError } from './errorHandler';

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Chưa xác thực'));
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(new AppError(403, 'Bạn không có quyền thực hiện thao tác này'));
    }

    next();
  };
};
