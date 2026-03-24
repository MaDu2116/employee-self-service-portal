import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config/constants';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../middleware/errorHandler';
import { AuthPayload } from '../types';

const SALT_ROUNDS = 10;

export const authService = {
  login: async (email: string, password: string) => {
    if (!email || !password) {
      throw new AppError(400, 'Email và mật khẩu không được để trống');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Email hoặc mật khẩu không đúng');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(401, 'Email hoặc mật khẩu không đúng');
    }

    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.JWT_EXPIRES_IN,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  },

  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    role?: 'HR_ADMIN' | 'EMPLOYEE';
    departmentId?: number;
    position?: string;
  }) => {
    if (!data.email || !data.password || !data.fullName) {
      throw new AppError(400, 'Email, mật khẩu và họ tên không được để trống');
    }

    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, 'Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  },

  hashPassword: (password: string) => bcrypt.hash(password, SALT_ROUNDS),
};
