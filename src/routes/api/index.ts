import { Router } from "express";
import { auth } from "../../middlewares/auth";
import UserRouter from "./user";
import AuthRouter from "./auth";
import AdminRouter from "./admin";
import { admin } from "../../middlewares/admin-auth";
const router = Router();

router.use("/user", auth, UserRouter);

router.use("/admin", auth, admin, AdminRouter);

router.use("/auth", AuthRouter);
export default router;
