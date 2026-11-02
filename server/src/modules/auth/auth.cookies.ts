
import type { Response } from "express";
import { env } from "../../config/env.ts";

export const SESSION_COOKIE_NAME = "helpdesk_session";
//secutity
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,//prevent Cross-Site Request Forgery
  path: "/",
};

export function setSessionCookie(
  res: Response,
  token: string,
  expiresAt: Date
) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    ...cookieOptions,
    expires: expiresAt,
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(
    SESSION_COOKIE_NAME,
    cookieOptions
  );
}
