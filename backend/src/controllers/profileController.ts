import { Response, NextFunction } from 'express';
import { profileService } from '../services/profileService';
import { AuthRequest } from '../types';

export const profileController = {
  getProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profile = await profileService.getProfile(req.user!.userId);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await profileService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  },
};
