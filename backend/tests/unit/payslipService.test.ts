import { payslipService } from '../../src/services/payslipService';
import { payslipRepository } from '../../src/repositories/payslipRepository';
import { AppError } from '../../src/middleware/errorHandler';

jest.mock('../../src/repositories/payslipRepository');
jest.mock('../../src/config/database', () => ({}));

const mockPayslipRepo = payslipRepository as jest.Mocked<typeof payslipRepository>;

describe('payslipService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getMyPayslips', () => {
    it('should return payslips for a user', async () => {
      const mockPayslips = [
        { id: 1, userId: 1, month: 1, year: 2026, filePath: '/uploads/test.pdf', uploadedAt: new Date() },
      ];
      mockPayslipRepo.findByUserId.mockResolvedValue(mockPayslips);

      const result = await payslipService.getMyPayslips(1);
      expect(result).toEqual(mockPayslips);
      expect(mockPayslipRepo.findByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('getPayslipFile', () => {
    it('should throw error when payslip not found', async () => {
      mockPayslipRepo.findById.mockResolvedValue(null);
      await expect(payslipService.getPayslipFile(999, 1, 'EMPLOYEE'))
        .rejects.toThrow('Không tìm thấy phiếu lương');
    });

    it('should throw error when employee tries to access others payslip', async () => {
      mockPayslipRepo.findById.mockResolvedValue({
        id: 1, userId: 2, month: 1, year: 2026, filePath: '/test.pdf', uploadedAt: new Date(),
      });
      await expect(payslipService.getPayslipFile(1, 1, 'EMPLOYEE'))
        .rejects.toThrow('Bạn không có quyền xem phiếu lương này');
    });

    it('should allow HR_ADMIN to access any payslip', async () => {
      const mockPayslip = { id: 1, userId: 2, month: 1, year: 2026, filePath: '/test.pdf', uploadedAt: new Date() };
      mockPayslipRepo.findById.mockResolvedValue(mockPayslip);

      const result = await payslipService.getPayslipFile(1, 1, 'HR_ADMIN');
      expect(result).toEqual(mockPayslip);
    });

    it('should allow owner to access own payslip', async () => {
      const mockPayslip = { id: 1, userId: 1, month: 1, year: 2026, filePath: '/test.pdf', uploadedAt: new Date() };
      mockPayslipRepo.findById.mockResolvedValue(mockPayslip);

      const result = await payslipService.getPayslipFile(1, 1, 'EMPLOYEE');
      expect(result).toEqual(mockPayslip);
    });
  });

  describe('uploadPayslip', () => {
    it('should throw error for invalid month', async () => {
      await expect(payslipService.uploadPayslip({ userId: 1, month: 13, year: 2026, filePath: '/test.pdf' }))
        .rejects.toThrow('Tháng phải từ 1 đến 12');
    });

    it('should throw error for invalid year', async () => {
      await expect(payslipService.uploadPayslip({ userId: 1, month: 1, year: 1999, filePath: '/test.pdf' }))
        .rejects.toThrow('Năm không hợp lệ');
    });

    it('should throw error if payslip already exists', async () => {
      mockPayslipRepo.findExisting.mockResolvedValue({
        id: 1, userId: 1, month: 1, year: 2026, filePath: '/test.pdf', uploadedAt: new Date(),
      });
      await expect(payslipService.uploadPayslip({ userId: 1, month: 1, year: 2026, filePath: '/test.pdf' }))
        .rejects.toThrow('Phiếu lương tháng 1/2026 đã tồn tại');
    });

    it('should create payslip successfully', async () => {
      mockPayslipRepo.findExisting.mockResolvedValue(null);
      const mockCreated = { id: 1, userId: 1, month: 3, year: 2026, filePath: '/test.pdf', uploadedAt: new Date() };
      mockPayslipRepo.create.mockResolvedValue(mockCreated);

      const result = await payslipService.uploadPayslip({ userId: 1, month: 3, year: 2026, filePath: '/test.pdf' });
      expect(result).toEqual(mockCreated);
    });
  });
});
