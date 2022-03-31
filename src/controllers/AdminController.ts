import { Request, Response } from "express";
import AdminService from "../services/admin";
import { numberTest } from "../utils/strUtils";

export const allUsers = async (req: Request, res: Response) => {
  const users = await AdminService.allUsers();
  if (!users) return res.status(400).json({ error: "Bad request" });
  return res.status(200).json(users);
};
export const approveUser = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  let user = {};
  if (id) user = await AdminService.approveUser(id, status);
  if (!user) return res.status(400).json({ error: "Bad request" });
  return res.status(200).json({ user, success: true });
};
export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.body;
  let user = {};
  if (id) user = await AdminService.removeUser(id);
  if (!user) return res.status(400).json({ error: "Bad request" });
  return res.status(200).json({ user, success: true });
};
export const oneUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || numberTest(id)) {
    const user = await AdminService.oneUser(parseInt(id));
    if (!user) return res.status(400).json({ error: "Bad request" });
    return res.status(200).json({ user, success: true });
  } else return res.status(400).json({ error: "Bad request" });
};
