import { Router } from "express";
import {
  removeAddress,
  updateOrCreateAddress,
} from "../../../controllers/UserController";
const router = Router();
router.post("/update", updateOrCreateAddress);
router.post("/remove", removeAddress);
export default router;
