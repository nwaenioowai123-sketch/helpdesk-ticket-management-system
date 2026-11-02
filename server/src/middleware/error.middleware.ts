
import type { ErrorRequestHandler } from "express";
import { ApiError } from "../common/errors/ApiError.ts";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (res.headersSent) {
    next(error);
    return;
  }
//api error
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }
//json error 
  if (
    error instanceof SyntaxError &&
    "body" in error
  ) {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "Invalid JSON request body",
      },
    });
    return;
  }
//other errors 500 internal server
  console.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
    },
  });
};
