import { announcementService } from '../../src/services/announcementService';
import { announcementRepository } from '../../src/repositories/announcementRepository';

jest.mock('../../src/repositories/announcementRepository');
jest.mock('../../src/config/database', () => ({}));

const mockAnnouncementRepo = announcementRepository as jest.Mocked<typeof announcementRepository>;

describe('announcementService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllAnnouncements', () => {
    it('should return all announcements', async () => {
      mockAnnouncementRepo.findAll.mockResolvedValue([]);
      const result = await announcementService.getAllAnnouncements();
      expect(result).toEqual([]);
    });
  });

  describe('getAnnouncementById', () => {
    it('should throw error when not found', async () => {
      mockAnnouncementRepo.findById.mockResolvedValue(null);
      await expect(announcementService.getAnnouncementById(999))
        .rejects.toThrow('Không tìm thấy thông báo');
    });
  });

  describe('createAnnouncement', () => {
    it('should throw error when title is empty', async () => {
      await expect(announcementService.createAnnouncement(1, '', 'content'))
        .rejects.toThrow('Tiêu đề và nội dung không được để trống');
    });

    it('should create announcement successfully', async () => {
      const mockAnnouncement = {
        id: 1,
        title: 'Test',
        content: 'Content',
        authorId: 1,
        createdAt: new Date(),
        author: { id: 1, fullName: 'Admin' },
      };
      mockAnnouncementRepo.create.mockResolvedValue(mockAnnouncement);

      const result = await announcementService.createAnnouncement(1, 'Test', 'Content');
      expect(result.title).toBe('Test');
    });
  });
});
