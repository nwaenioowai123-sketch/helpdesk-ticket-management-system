
import { prisma } from "../../lib/prisma.ts";
import { ApiError } from "../../common/errors/ApiError.ts";

export async function getHealthInfo() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("Database health check failed:", error);

    throw new ApiError(
      503,
      "Database is unavailable",
      "DATABASE_UNAVAILABLE"
    );
  }

  return {
    service: "helpdesk-ticket-management-system",
    status: "ok",
    database: "connected",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}
