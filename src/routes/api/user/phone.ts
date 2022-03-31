import { Router } from "express";
import { removePhone, createPhone } from "../../../controllers/UserController";
const router = Router();
router.post("/create", createPhone);
router.post("/remove", removePhone);
export default router;
