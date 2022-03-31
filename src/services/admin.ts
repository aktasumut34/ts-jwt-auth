import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default {
  // Users
  allUsers: async () => {
    const users = await prisma.user.findMany({
      where: {
        Role: {
          isNot: {
            name: "Admin",
          },
        },
      },
      include: {
        Phones: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const approved = users.filter((user) => user.status === 1);
    const pending = users.filter((user) => user.status === 0);
    const blocked = users.filter((user) => user.status === -1);
    return { approved, pending, blocked };
  },
  approveUser: async (id: number, status: number) => {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    });
    if (status === 0 || status === -1) {
      await prisma.token.deleteMany({
        where: {
          user_id: id,
        },
      });
    }
    return user;
  },
  removeUser: async (id: number) => {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return user;
  },
  oneUser: async (id: number) => {
    return await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        Phones: true,
        Addresses: true,
        Role: true,
        Tokens: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        id: true,
      },
    });
  },
};
