import express, { urlencoded } from "express";
import router from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  rateLimiterMiddleware,
  speedLimiter,
} from "./middlewares/rate-limiter";
dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiterMiddleware);
app.use(speedLimiter);
app.use(router);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
