import { PrismaClient, User } from "@prisma/client";
const prisma = new PrismaClient();
export default {
  me: async (user: User) => {
    const errors = [];
    const userDetailed = await prisma.user.findFirst({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        Role: true,
        Addresses: true,
        Phones: true,
      },
    });
    if (!userDetailed) {
      errors.push({
        message: "User not found",
        type: "auth",
      });
    }
    return { user: userDetailed, errors };
  },
  updateOrCreateAddress: async (user: User, address: any) => {
    const errors = [];
    const userDetailed = await prisma.user.findFirst({
      where: { id: user.id },
      select: {
        Addresses: true,
      },
    });
    if (!userDetailed) {
      errors.push({
        message: "User not found",
        type: "auth",
      });
    }
    const addressExists = userDetailed?.Addresses.find(
      (add) => add.id === address.id
    );
    if (addressExists) {
      await prisma.address.update({
        where: { id: address.id },
        data: {
          ...address,
        },
      });
    } else {
      delete address.id;
      await prisma.address.create({
        data: {
          ...address,
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    return { errors };
  },
  createPhone: async (user: User, phone: { number: string }) => {
    const errors = [];
    let p;
    const phoneExists = await prisma.phone.findFirst({
      where: { number: phone.number },
    });
    if (phoneExists) {
      errors.push({
        message: "Phone number already exists!",
        type: "unique",
      });
    } else {
      try {
        p = await prisma.phone.create({
          data: {
            number: phone.number,
            faCode: "",
            User: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } catch {
        errors.push({
          message: "Something went wrong",
          type: "auth",
        });
      }
    }
    return { errors, phone: p };
  },
  removeAddress: async (user: User, address_id: number) => {
    const errors = [];
    const userUpdated = await prisma.user.update({
      where: { id: user.id },
      data: {
        Addresses: {
          delete: { id: address_id },
        },
      },
    });
    if (!userUpdated) {
      errors.push({
        message: "User not found",
        type: "auth",
      });
    }
    return { errors };
  },
  removePhone: async (user: User, phone_id: number) => {
    const errors = [];
    const userUpdated = await prisma.user.update({
      where: { id: user.id },
      data: {
        Phones: {
          delete: { id: phone_id },
        },
      },
    });
    if (!userUpdated) {
      errors.push({
        message: "User not found",
        type: "auth",
      });
    }
    return { errors };
  },
};
