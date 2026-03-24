import { Request, Response, NextFunction } from 'express';
import { policyService } from '../services/policyService';

export const policyController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = req.query.category as string | undefined;
      const policies = await policyService.getAllPolicies(category);
      res.json({ success: true, data: policies });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const policy = await policyService.getPolicyById(id);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = req.query.q as string;
      const policies = await policyService.searchPolicies(q);
      res.json({ success: true, data: policies });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const policy = await policyService.createPolicy(req.body);
      res.status(201).json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const policy = await policyService.updatePolicy(id, req.body);
      res.json({ success: true, data: policy });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      await policyService.deletePolicy(id);
      res.json({ success: true, message: 'Đã xóa chính sách' });
    } catch (error) {
      next(error);
    }
  },

  getCategories: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await policyService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  },
};
