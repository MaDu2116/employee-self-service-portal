import { announcementRepository } from '../repositories/announcementRepository';
import { AppError } from '../middleware/errorHandler';

export const announcementService = {
  getAllAnnouncements: async () => {
    return announcementRepository.findAll();
  },

  getAnnouncementById: async (id: number) => {
    const announcement = await announcementRepository.findById(id);
    if (!announcement) {
      throw new AppError(404, 'Không tìm thấy thông báo');
    }
    return announcement;
  },

  createAnnouncement: async (authorId: number, title: string, content: string) => {
    if (!title || !content) {
      throw new AppError(400, 'Tiêu đề và nội dung không được để trống');
    }
    return announcementRepository.create({ title, content, authorId });
  },
};
