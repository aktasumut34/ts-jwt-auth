import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export interface TokenInterface {
  user: User;
}
interface IRefreshRequest {
  oldRefreshToken?: string;
  user: User;
}
export const createToken = async (user: User): Promise<string> => {
  return jwt.sign({ user }, <string>process.env.JWT_AUTH_SECRET, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};
export const createRefreshToken = async (
  req: IRefreshRequest
): Promise<string> => {
  const { user, oldRefreshToken } = req;
  const refreshToken = jwt.sign(
    { user },
    <string>process.env.JWT_REFRESH_SECRET
  );
  await prisma.token.create({
    data: {
      token: refreshToken,
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  if (oldRefreshToken) {
    await prisma.token.deleteMany({
      where: { token: oldRefreshToken },
    });
  }
  return refreshToken;
};
export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const decoded = <TokenInterface>(
      jwt.verify(token, <string>process.env.JWT_AUTH_SECRET)
    );
    if (decoded && decoded.user) {
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.user.id,
          status: 1,
        },
      });
      if (user) {
        return user;
      } else return null;
    } else {
      throw new Error("invalid token");
    }
  } catch (e) {
    return null;
  }
};
