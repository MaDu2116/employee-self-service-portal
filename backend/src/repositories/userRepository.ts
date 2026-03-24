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

  searchUsers: (query: string) =>
    prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          ...(isNaN(Number(query)) ? [] : [{ id: Number(query) }]),
        ],
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        position: true,
        department: { select: { id: true, name: true } },
      },
      orderBy: { fullName: 'asc' },
      take: 50,
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
