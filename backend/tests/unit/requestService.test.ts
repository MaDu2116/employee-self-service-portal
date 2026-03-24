import { requestService } from '../../src/services/requestService';
import { requestRepository } from '../../src/repositories/requestRepository';

jest.mock('../../src/repositories/requestRepository');
jest.mock('../../src/config/database', () => ({}));

const mockRequestRepo = requestRepository as jest.Mocked<typeof requestRepository>;

describe('requestService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getRequests', () => {
    it('should return all requests for HR_ADMIN', async () => {
      mockRequestRepo.findAll.mockResolvedValue([]);
      await requestService.getRequests(1, 'HR_ADMIN');
      expect(mockRequestRepo.findAll).toHaveBeenCalled();
    });

    it('should return user requests for EMPLOYEE', async () => {
      mockRequestRepo.findByUserId.mockResolvedValue([]);
      await requestService.getRequests(1, 'EMPLOYEE');
      expect(mockRequestRepo.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('createRequest', () => {
    it('should throw error when type is empty', async () => {
      await expect(requestService.createRequest(1, '', 'details'))
        .rejects.toThrow('Loại yêu cầu và chi tiết không được để trống');
    });

    it('should throw error for invalid type', async () => {
      await expect(requestService.createRequest(1, 'INVALID', 'details'))
        .rejects.toThrow('Loại yêu cầu không hợp lệ');
    });

    it('should create request with valid data', async () => {
      const mockCreated = {
        id: 1,
        userId: 1,
        type: 'WORK_CONFIRMATION' as const,
        status: 'PENDING' as const,
        details: 'Test',
        response: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequestRepo.create.mockResolvedValue(mockCreated);

      const result = await requestService.createRequest(1, 'WORK_CONFIRMATION', 'Test');
      expect(result).toEqual(mockCreated);
    });
  });

  describe('updateRequestStatus', () => {
    it('should throw error for invalid status', async () => {
      await expect(requestService.updateRequestStatus(1, 'INVALID'))
        .rejects.toThrow('Trạng thái không hợp lệ');
    });

    it('should throw error when request not found', async () => {
      mockRequestRepo.findById.mockResolvedValue(null);
      await expect(requestService.updateRequestStatus(999, 'APPROVED'))
        .rejects.toThrow('Không tìm thấy yêu cầu');
    });

    it('should update status successfully', async () => {
      mockRequestRepo.findById.mockResolvedValue({
        id: 1,
        userId: 1,
        type: 'WORK_CONFIRMATION' as const,
        status: 'PENDING' as const,
        details: 'Test',
        response: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, fullName: 'Test', email: 'test@test.com' },
      });
      const mockUpdated = {
        id: 1,
        userId: 1,
        type: 'WORK_CONFIRMATION' as const,
        status: 'APPROVED' as const,
        details: 'Test',
        response: 'Approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequestRepo.updateStatus.mockResolvedValue(mockUpdated);

      const result = await requestService.updateRequestStatus(1, 'APPROVED', 'Approved');
      expect(result.status).toBe('APPROVED');
    });
  });
});
