import { createRefreshToken, createToken } from "./token";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface Error {
  message: string;
  type: string;
  details?: string;
}
interface IAuthResponse {
  token: string | null;
  refreshToken: string | null;
  errors: Error[] | null;
}
interface IAuthRequest {
  email?: string;
  password?: string;
  name?: string;
  refreshToken?: string;
  oldRefreshToken?: string;
}
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword: string = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return hashedPassword;
}
async function hashCompare(
  password: string,
  comparePassword: string
): Promise<boolean> {
  const compare: boolean = await new Promise((resolve, reject) => {
    bcrypt.compare(password, comparePassword, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
  return compare;
}
export default {
  login: async (req: IAuthRequest): Promise<IAuthResponse> => {
    const errors: Error[] = [];
    let token = null,
      refreshToken = null;
    if (!req.email || !req.password) {
      errors.push({
        message: "Please provide email and password!",
        type: "auth",
      });
    } else {
      const user = await prisma.user.findFirst({ where: { email: req.email } });
      if (!user) {
        errors.push({
          message: "User not found with provided email!",
          type: "email",
        });
      } else if (user.status === -1) {
        errors.push({
          message:
            "Your account has been blocked! Please contact with us via email!",
          type: "email",
        });
      } else if (user.status === 0) {
        errors.push({
          message:
            "Your account hasn't been approved yet! Our sales team will contact you soon.",
          type: "email",
        });
      } else {
        try {
          const result = await hashCompare(req.password, user.password);
          if (!result) {
            errors.push({
              message: "Password was incorrect!",
              type: "password",
            });
          } else {
            token = await createToken(user);
            refreshToken = await createRefreshToken({ user });
          }
        } catch (e) {
          errors.push({
            message: "Error occured",
            type: "auth",
          });
        }
      }
    }
    return { token, refreshToken, errors };
  },
  register: async (req: IAuthRequest): Promise<IAuthResponse> => {
    const errors: Error[] = [];
    let token = null,
      refreshToken = null;
    if (!req.email || !req.password || !req.name) {
      errors.push({
        message: "Please provide email, password and name",
        type: "auth",
      });
    } else {
      const user = await prisma.user.findFirst({ where: { email: req.email } });
      if (user) {
        errors.push({
          message: "There is an account with this email",
          type: "email",
        });
      } else {
        try {
          const hash = await hashPassword(req.password);
          const user = await prisma.user.create({
            data: {
              email: req.email,
              password: hash,
              name: req.name,
              roleId: 1,
            },
          });
          token = await createToken(user);
          refreshToken = await createRefreshToken({ user });
        } catch (err: any) {
          errors.push({
            message: "Error occured",
            type: "auth",
            details: err.message,
          });
        }
      }
    }
    return { token, refreshToken, errors };
  },
  refreshToken: async (req: IAuthRequest): Promise<IAuthResponse> => {
    const errors: Error[] = [];
    let accessToken = null,
      refreshToken = null;
    if (!req.refreshToken) {
      errors.push({
        message: "Please provide refresh token",
        type: "auth",
      });
    } else {
      const token = await prisma.token.findFirst({
        where: { token: req.refreshToken },
        include: { User: true },
      });
      if (!token) {
        errors.push({
          message: "Refresh token not found",
          type: "auth",
        });
      } else {
        if (!token.User) {
          errors.push({
            message: "User not found",
            type: "auth",
          });
        } else {
          accessToken = await createToken(token.User);
          refreshToken = await createRefreshToken({
            user: token.User,
            oldRefreshToken: req.oldRefreshToken,
          });
        }
      }
    }
    return { token: accessToken, refreshToken, errors };
  },
  logout: async (req: IAuthRequest): Promise<Error[]> => {
    const errors: Error[] = [];
    if (!req.refreshToken) {
      errors.push({
        message: "Please provide refresh token",
        type: "auth",
      });
    } else {
      await prisma.token
        .deleteMany({ where: { token: req.refreshToken } })
        .then((token) => {
          if (!token) {
            errors.push({
              message: "Refresh token not found",
              type: "auth",
            });
          }
        });
    }
    return errors;
  },
  validateEmail: async (req: IAuthRequest): Promise<boolean> => {
    const user = await prisma.user.findFirst({ where: { email: req.email } });
    const used = user ? true : false;
    return used;
  },
};
