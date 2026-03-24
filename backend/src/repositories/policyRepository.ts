import prisma from '../config/database';
import { PolicyCreateBody } from '../types';

export const policyRepository = {
  findAll: (category?: string) =>
    prisma.policy.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.policy.findUnique({ where: { id } }),

  search: (keyword: string) =>
    prisma.policy.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    }),

  create: (data: PolicyCreateBody & { filePath?: string }) =>
    prisma.policy.create({ data }),

  update: (id: number, data: Partial<PolicyCreateBody>) =>
    prisma.policy.update({ where: { id }, data }),

  delete: (id: number) =>
    prisma.policy.delete({ where: { id } }),

  getCategories: () =>
    prisma.policy.findMany({
      select: { category: true },
      distinct: ['category'],
    }),
};
