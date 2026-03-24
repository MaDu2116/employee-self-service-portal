import prisma from '../config/database';

export const announcementRepository = {
  findAll: () =>
    prisma.announcement.findMany({
      include: { author: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) =>
    prisma.announcement.findUnique({
      where: { id },
      include: { author: { select: { id: true, fullName: true } } },
    }),

  create: (data: { title: string; content: string; authorId: number }) =>
    prisma.announcement.create({
      data,
      include: { author: { select: { id: true, fullName: true } } },
    }),
};
