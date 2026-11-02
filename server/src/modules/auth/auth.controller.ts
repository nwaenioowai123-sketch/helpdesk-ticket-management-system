
import type { RequestHandler } from "express";

import { ApiError } from "../../common/errors/ApiError.ts";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.ts";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "./auth.service.ts";

import {
  SESSION_COOKIE_NAME,
  setSessionCookie,
  clearSessionCookie,
} from "./auth.cookies.ts";

// ===============================
// REGISTER
// ===============================

export const register: RequestHandler = async (
  req,
  res
) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues.map((issue) => issue.message).join(", "),
      "VALIDATION_ERROR"
    );
  }

  const session = await registerUser(result.data);

  setSessionCookie(
    res,
    session.token,
    session.expiresAt
  );

  res.status(201).json({
    success: true,
    data: {
      user: session.user,
    },
  });
};

// ===============================
// LOGIN
// ===============================

export const login: RequestHandler = async (
  req,
  res
) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues.map((issue) => issue.message).join(", "),
      "VALIDATION_ERROR"
    );
  }

  const session = await loginUser(result.data);

  setSessionCookie(
    res,
    session.token,
    session.expiresAt
  );

  res.status(200).json({
    success: true,
    data: {
      user: session.user,
    },
  });
};

// ===============================
// CURRENT USER
// ===============================

export const getCurrentUser: RequestHandler = (
  _req,
  res
) => {
  const user = res.locals.user;

  if (!user) {
    throw new ApiError(
      401,
      "Authentication required",
      "UNAUTHENTICATED"
    );
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};

// ===============================
// LOGOUT
// ===============================

export const logout: RequestHandler = async (
  req,
  res
) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token === "string") {
    await logoutUser(token);
  }

  clearSessionCookie(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
