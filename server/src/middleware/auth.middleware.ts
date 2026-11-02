
import type { RequestHandler } from "express";

import { ApiError } from "../common/errors/ApiError.ts";
import {
  getUserFromSession,
} from "../modules/auth/auth.service.ts";

import {
  SESSION_COOKIE_NAME,
  clearSessionCookie,
} from "../modules/auth/auth.cookies.ts";

export const requireAuth: RequestHandler = async (
  req,
  res,
  next
) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token !== "string") {//no tokern = no login
    throw new ApiError(
      401,
      "Authentication required",
      "UNAUTHENTICATED"
    );
  }

  const user = await getUserFromSession(token);

  if (!user) {
    clearSessionCookie(res);

    throw new ApiError(
      401,
      "Session expired or invalid",
      "INVALID_SESSION"
    );
  }

  res.locals.user = user;

  next();
};
