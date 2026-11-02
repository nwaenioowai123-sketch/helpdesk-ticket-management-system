
import express from "express";
import cors from "cors";//security package
import helmet from "helmet";//security package

import { env } from "./config/env.ts";
import { healthRouter } from "./modules/health/health.routes.ts";
import { errorHandler } from "./middleware/error.middleware.ts";
import { ApiError } from "./common/errors/ApiError.ts";

const app = express();

// Security
app.disable("x-powered-by");//http header desible use ""
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  })
);

// Parse JSON requests
app.use(express.json({ limit: "1mb" }));

// API routes
app.use("/api/health", healthRouter);

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

// Centralized error handler
app.use(errorHandler);

export { app };
