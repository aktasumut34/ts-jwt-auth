import { User } from "@prisma/client";
import { Request, Response } from "express";
import UserService from "../services/user";
interface IAuthReqeust extends Request {
  user?: User;
  token?: string;
}
export const me = async (req: IAuthReqeust, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const { errors, user } = await UserService.me(req.user);
  const token = req.token;
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  return res.status(200).json({ user, token });
};

export const updateOrCreateAddress = async (
  req: IAuthReqeust,
  res: Response
) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const address = req.body;
  const { errors } = await UserService.updateOrCreateAddress(req.user, address);
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  return res.status(200).json({ success: true });
};

export const createPhone = async (req: IAuthReqeust, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const { phone } = req.body;
  const { errors } = await UserService.createPhone(req.user, phone);
  if (errors?.length) {
    return res.status(200).json({ errors });
  }
  return res.status(200).json({ success: true });
};

export const removeAddress = async (req: IAuthReqeust, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const address_id = req.body.address_id;
  const { errors } = await UserService.removeAddress(req.user, address_id);
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  return res.status(200).json({ success: true });
};

export const removePhone = async (req: IAuthReqeust, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  const phone_id = req.body.phone_id;
  const { errors } = await UserService.removePhone(req.user, phone_id);
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  return res.status(200).json({ success: true });
};
