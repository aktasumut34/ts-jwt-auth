import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

interface IAuthRequest extends Request {
  user?: User;
}

export const admin = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.roleId === 1337) {
    next();
  } else res.status(401).json({ error: "Unauthorized" });
};
