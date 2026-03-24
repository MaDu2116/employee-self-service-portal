import { userRepository } from '../repositories/userRepository';
import { AppError } from '../middleware/errorHandler';
import { ProfileUpdateBody } from '../types';

export const profileService = {
  getProfile: async (userId: number) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'Không tìm thấy người dùng');
    }
    return user;
  },

  updateProfile: async (userId: number, data: ProfileUpdateBody) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'Không tìm thấy người dùng');
    }

    return userRepository.updateProfile(userId, data);
  },
};
