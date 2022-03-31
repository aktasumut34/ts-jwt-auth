import { Router } from "express";
import {
  allUsers,
  approveUser,
  removeUser,
  oneUser,
} from "../../../controllers/AdminController";
const router = Router();
router.get("/all", allUsers);
router.post("/approve", approveUser);
router.post("/remove", removeUser);
router.get("/:id", oneUser);
export default router;
