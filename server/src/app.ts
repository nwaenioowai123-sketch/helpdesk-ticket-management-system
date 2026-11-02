
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.ts";

import { healthRouter } from "./modules/health/health.routes.ts";
import { authRouter } from "./modules/auth/auth.routes.ts";

import { errorHandler } from "./middleware/error.middleware.ts";
import { ApiError } from "./common/errors/ApiError.ts";

const app = express();

// Security headers
app.disable("x-powered-by");
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: "1mb" }));

// Cookie parsing
app.use(cookieParser());

// Health API
app.use("/api/health", healthRouter);

// Authentication APIs
app.use("/api/auth", authRouter);

// Unknown routes
app.use((_req, _res, next) => {
  next(
    new ApiError(
      404,
      "API route not found",
      "ROUTE_NOT_FOUND"
    )
  );
});

// Centralized error handling
app.use(errorHandler);

export { app };
