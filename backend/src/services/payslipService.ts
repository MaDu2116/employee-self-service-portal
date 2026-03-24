import { payslipRepository } from '../repositories/payslipRepository';
import { AppError } from '../middleware/errorHandler';

export const payslipService = {
  getMyPayslips: async (userId: number) => {
    return payslipRepository.findByUserId(userId);
  },

  getPayslipFile: async (payslipId: number, userId: number, userRole: string) => {
    const payslip = await payslipRepository.findById(payslipId);
    if (!payslip) {
      throw new AppError(404, 'Không tìm thấy phiếu lương');
    }

    if (userRole !== 'HR_ADMIN' && payslip.userId !== userId) {
      throw new AppError(403, 'Bạn không có quyền xem phiếu lương này');
    }

    return payslip;
  },

  uploadPayslip: async (data: {
    userId: number;
    month: number;
    year: number;
    filePath: string;
  }) => {
    if (data.month < 1 || data.month > 12) {
      throw new AppError(400, 'Tháng phải từ 1 đến 12');
    }

    if (data.year < 2000 || data.year > 2100) {
      throw new AppError(400, 'Năm không hợp lệ');
    }

    const existing = await payslipRepository.findExisting(
      data.userId,
      data.month,
      data.year
    );

    if (existing) {
      throw new AppError(409, `Phiếu lương tháng ${data.month}/${data.year} đã tồn tại`);
    }

    return payslipRepository.create(data);
  },
};
