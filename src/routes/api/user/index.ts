import { Router } from "express";
import { me } from "../../../controllers/UserController";
import AddressRouter from "./address";
import PhoneRouter from "./phone";
const router = Router();
router.get("/", me);

router.use("/address", AddressRouter);
router.use("/phone", PhoneRouter);
export default router;
