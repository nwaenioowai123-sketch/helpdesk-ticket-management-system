
import type { RequestHandler } from "express";
import { getHealthInfo } from "./health.service.ts";

export const getHealth: RequestHandler = async (
  _req,
  res
) => {
  const health = await getHealthInfo();

  res.status(200).json({
    success: true,
    data: health,
  });
};
