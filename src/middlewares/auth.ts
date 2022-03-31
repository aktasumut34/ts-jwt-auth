import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import {
  createRefreshToken,
  createToken,
  verifyToken,
} from "../services/token";

interface IAuthRequest extends Request {
  user?: User;
  token?: string;
}

export const auth = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  } else {
    const user = await verifyToken(token);
    if (!user) {
      const refresh_token = req.cookies?.refresh_token;
      if (refresh_token) {
        const nUser = await verifyToken(refresh_token);
        if (nUser) {
          const nToken = await createToken(nUser);
          const nRefreshToken = await createRefreshToken({
            user: nUser,
            oldRefreshToken: refresh_token,
          });
          res.cookie("refresh_token", nRefreshToken, {
            secure: true,
            httpOnly: true,
          });
          req.user = nUser;
          req.token = nToken;
          next();
        }
      } else {
        res.cookie("refresh_token", "", {
          secure: true,
          httpOnly: true,
        });
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      return res.status(401).json({
        message: "Invalid token",
      });
    } else {
      req.token = token;
      req.user = user;
    }
  }
  next();
};
