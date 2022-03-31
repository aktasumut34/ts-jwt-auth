import { NextFunction, Request, Response } from "express";
import slowDown from "express-slow-down";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  duration: 60,
  points: 200,
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};
export const speedLimiter = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 100,
  delayMs: 20,
});
