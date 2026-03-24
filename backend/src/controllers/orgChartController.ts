import { Request, Response, NextFunction } from 'express';
import { orgChartService } from '../services/orgChartService';

export const orgChartController = {
  getOrgChart: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orgChart = await orgChartService.getOrgChart();
      res.json({ success: true, data: orgChart });
    } catch (error) {
      next(error);
    }
  },
};
