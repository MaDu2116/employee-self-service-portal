import { Response, NextFunction } from 'express';
import { announcementService } from '../services/announcementService';
import { AuthRequest } from '../types';

export const announcementController = {
  getAll: async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const announcements = await announcementService.getAllAnnouncements();
      res.json({ success: true, data: announcements });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, content } = req.body;
      const result = await announcementService.createAnnouncement(
        req.user!.userId,
        title,
        content
      );
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};
