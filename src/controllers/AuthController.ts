import { Request, Response } from "express";
import AuthService from "../services/auth";
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { errors, token, refreshToken } = await AuthService.login({
    email,
    password,
  });
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  res.cookie("refresh_token", refreshToken, {
    secure: true,
    httpOnly: true,
  });
  return res.status(200).json({ token });
};
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const { errors, token, refreshToken } = await AuthService.register({
    email,
    password,
    name,
  });
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  res.cookie("refresh_token", refreshToken, {
    secure: true,
    httpOnly: true,
  });
  return res.status(200).json({ token });
};
export const refreshToken = async (req: Request, res: Response) => {
  const refresh_token: string = req.cookies?.refresh_token;
  const {
    errors,
    token,
    refreshToken: newRefreshToken,
  } = await AuthService.refreshToken({
    refreshToken: refresh_token,
    oldRefreshToken: refresh_token,
  });
  if (errors?.length) {
    res.cookie("refresh_token", "");
    return res.status(400).json({ errors });
  }
  res.cookie("refresh_token", newRefreshToken, {
    secure: true,
    httpOnly: true,
  });
  return res.status(200).json({ token });
};
export const logout = async (req: Request, res: Response) => {
  const refresh_token: string = req.cookies?.refresh_token;
  const errors = await AuthService.logout({
    refreshToken: refresh_token,
  });
  if (errors?.length) {
    return res.status(400).json({ errors });
  }
  res.cookie("refresh_token", "", {
    secure: true,
    httpOnly: true,
  });
  return res.status(200).json({ success: true });
};

export const validateEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  const used = await AuthService.validateEmail({ email });
  return res.status(200).json({ used });
};
