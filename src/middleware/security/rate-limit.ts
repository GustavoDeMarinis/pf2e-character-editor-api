import rateLimit, { Options } from "express-rate-limit";
import { Request } from "express";

// express-rate-limit defaults to an in-memory store which does not survive
// restarts and does not work across multiple processes. Swap the `store` option
// for a Redis-backed store (e.g. rate-limit-redis) in production.
const base: Partial<Options> = {
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Please try again later.",
};

const userAndIpKey = (req: Request): string =>
  `${req.auth?.userId ?? "anon"}:${req.ip}`;

export const globalLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000, // 1 minute
  max: 300,
});

export const signInLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

export const signUpLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
});

// Keyed on userId+IP so shared NATs don't lock out other users
export const refreshLimiter = rateLimit({
  ...base,
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  keyGenerator: userAndIpKey,
});

export const passwordChangeLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: userAndIpKey,
});
