import prisma from '../config/database';

export const departmentRepository = {
  findAll: () =>
    prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            position: true,
            email: true,
          },
        },
        children: {
          include: {
            users: {
              select: {
                id: true,
                fullName: true,
                position: true,
                email: true,
              },
            },
          },
        },
      },
    }),

  findRoots: () =>
    prisma.department.findMany({
      where: { parentId: null },
      include: {
        users: {
          select: { id: true, fullName: true, position: true, email: true },
        },
        children: {
          include: {
            users: {
              select: { id: true, fullName: true, position: true, email: true },
            },
            children: {
              include: {
                users: {
                  select: { id: true, fullName: true, position: true, email: true },
                },
              },
            },
          },
        },
      },
    }),
};
