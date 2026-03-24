import prisma from '../config/database';
import { ProfileUpdateBody } from '../types';

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        address: true,
        bankAccount: true,
        position: true,
        departmentId: true,
        department: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    }),

  updateProfile: (id: number, data: ProfileUpdateBody) =>
    prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        address: true,
        bankAccount: true,
        position: true,
        department: { select: { id: true, name: true } },
        updatedAt: true,
      },
    }),

  create: (data: {
    email: string;
    password: string;
    fullName: string;
    role?: 'HR_ADMIN' | 'EMPLOYEE';
    departmentId?: number;
    position?: string;
  }) => prisma.user.create({ data }),
};
