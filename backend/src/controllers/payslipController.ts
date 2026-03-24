import { Response, NextFunction } from 'express';
import path from 'path';
import { payslipService } from '../services/payslipService';
import { AuthRequest } from '../types';

export const payslipController = {
  getMyPayslips: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payslips = await payslipService.getMyPayslips(req.user!.userId);
      res.json({ success: true, data: payslips });
    } catch (error) {
      next(error);
    }
  },

  getPayslipsByUserId: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId as string, 10);
      const payslips = await payslipService.getPayslipsByUserId(userId);
      res.json({ success: true, data: payslips });
    } catch (error) {
      next(error);
    }
  },

  checkExisting: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const month = parseInt(req.query.month as string, 10);
      const year = parseInt(req.query.year as string, 10);
      const existing = await payslipService.checkExisting(userId, month, year);
      res.json({ success: true, data: { exists: !!existing } });
    } catch (error) {
      next(error);
    }
  },

  downloadPayslip: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payslipId = parseInt(req.params.id as string, 10);
      const payslip = await payslipService.getPayslipFile(
        payslipId,
        req.user!.userId,
        req.user!.role
      );
      const absolutePath = path.resolve(payslip.filePath);
      res.download(absolutePath);
    } catch (error) {
      next(error);
    }
  },

  uploadPayslip: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'Vui lòng chọn file PDF' });
        return;
      }

      const { userId, month, year } = req.body;
      const payslip = await payslipService.uploadPayslip({
        userId: parseInt(userId, 10),
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        filePath: req.file.path,
      });

      res.status(201).json({ success: true, data: payslip });
    } catch (error) {
      next(error);
    }
  },
};
