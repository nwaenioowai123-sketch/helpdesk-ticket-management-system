
import { Router } from "express";
import { rateLimit } from "express-rate-limit";

import {
  register,
  login,
  logout,
  getCurrentUser,
} from "./auth.controller.ts";

import { requireAuth } from "../../middleware/auth.middleware.ts";
import { requireTrustedOrigin } from "../../middleware/origin.middleware.ts";

const router = Router();

// Limit registration and login attempts.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,//15mins with milliseconds
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many authentication attempts. Please try again later.",
    },
  },
});

// Register
router.post(
  "/register",
  requireTrustedOrigin,//check domain correct of not 
  authRateLimiter,
  register
);

// Login
router.post(
  "/login",
  requireTrustedOrigin,
  authRateLimiter,
  login
);

// Current authenticated user
router.get(
  "/me",
  requireAuth,
  getCurrentUser
);

// Logout
router.post(
  "/logout",
  requireTrustedOrigin,
  logout
);

export { router as authRouter };//main app
