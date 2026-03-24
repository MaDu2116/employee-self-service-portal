import prisma from '../config/database';

export const payslipRepository = {
  findByUserId: (userId: number) =>
    prisma.payslip.findMany({
      where: { userId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    }),

  findById: (id: number) =>
    prisma.payslip.findUnique({ where: { id } }),

  create: (data: { userId: number; month: number; year: number; filePath: string }) =>
    prisma.payslip.create({ data }),

  findExisting: (userId: number, month: number, year: number) =>
    prisma.payslip.findUnique({
      where: { userId_month_year: { userId, month, year } },
    }),
};
