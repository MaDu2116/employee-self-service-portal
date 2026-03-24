import { RequestType, RequestStatus } from '@prisma/client';
import { requestRepository } from '../repositories/requestRepository';
import { AppError } from '../middleware/errorHandler';

const VALID_TYPES: string[] = Object.values(RequestType);
const VALID_STATUSES: string[] = Object.values(RequestStatus);

export const requestService = {
  getRequests: async (userId: number, role: string) => {
    if (role === 'HR_ADMIN') {
      return requestRepository.findAll();
    }
    return requestRepository.findByUserId(userId);
  },

  createRequest: async (userId: number, type: string, details: string) => {
    if (!type || !details) {
      throw new AppError(400, 'Loại yêu cầu và chi tiết không được để trống');
    }

    if (!VALID_TYPES.includes(type)) {
      throw new AppError(400, `Loại yêu cầu không hợp lệ. Chấp nhận: ${VALID_TYPES.join(', ')}`);
    }

    return requestRepository.create({
      userId,
      type: type as RequestType,
      details,
    });
  },

  updateRequestStatus: async (
    requestId: number,
    status: string,
    response?: string
  ) => {
    if (!VALID_STATUSES.includes(status)) {
      throw new AppError(400, `Trạng thái không hợp lệ. Chấp nhận: ${VALID_STATUSES.join(', ')}`);
    }

    const existing = await requestRepository.findById(requestId);
    if (!existing) {
      throw new AppError(404, 'Không tìm thấy yêu cầu');
    }

    return requestRepository.updateStatus(
      requestId,
      status as RequestStatus,
      response
    );
  },
};
