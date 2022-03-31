import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  validateEmail,
} from "../../controllers/AuthController";
const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/validate-email", validateEmail);

export default router;
