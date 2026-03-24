import prisma from '../config/database';
import { RequestType, RequestStatus } from '@prisma/client';

export const requestRepository = {
  findByUserId: (userId: number) =>
    prisma.adminRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),

  findAll: () =>
    prisma.adminRequest.findMany({
      include: { user: { select: { id: true, fullName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.adminRequest.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    }),

  create: (data: { userId: number; type: RequestType; details: string }) =>
    prisma.adminRequest.create({ data }),

  updateStatus: (id: number, status: RequestStatus, response?: string) =>
    prisma.adminRequest.update({
      where: { id },
      data: { status, response },
    }),
};
