import { Response, NextFunction } from 'express';
import { requestService } from '../services/requestService';
import { AuthRequest } from '../types';

export const requestController = {
  getRequests: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requests = await requestService.getRequests(req.user!.userId, req.user!.role);
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  },

  createRequest: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type, details } = req.body;
      const result = await requestService.createRequest(req.user!.userId, type, details);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = parseInt(req.params.id as string, 10);
      const { status, response } = req.body;
      const result = await requestService.updateRequestStatus(requestId, status, response);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
