import type { RequestHandler } from "express";

import { env } from "../config/env.ts";
import { ApiError } from "../common/errors/ApiError.ts";

export const requireTrustedOrigin: RequestHandler = (
  req,
  _res,
  next
) => {
  const origin = req.get("origin");

  if (origin && origin !== env.CORS_ORIGIN) {
    next(
      new ApiError(
        403,
        "Request origin is not allowed",
        "ORIGIN_NOT_ALLOWED"
      )
    );

    return;
  }

  next();
};
