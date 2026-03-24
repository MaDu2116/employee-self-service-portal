import { Response, NextFunction } from 'express';
import { profileService } from '../services/profileService';
import { userRepository } from '../repositories/userRepository';
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

  searchUsers: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) || '';
      if (!query.trim()) {
        res.json({ success: true, data: [] });
        return;
      }
      const users = await userRepository.searchUsers(query.trim());
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
};
