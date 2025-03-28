import rateLimit from "express-rate-limit";

export const signInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });