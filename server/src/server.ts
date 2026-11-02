
import { app } from "./app.ts";
import { env } from "./config/env.ts";
import { prisma } from "./lib/prisma.ts";

async function startServer() {
  try {
    await prisma.$connect();

    console.log("PostgreSQL connected successfully");

    const server = app.listen(
      env.PORT,
      "127.0.0.1",
      () => {
        console.log(
          `Helpdesk API running at http://localhost:${env.PORT}`
        );
      }
    );

    let shuttingDown = false;

    const shutdown = (signal: string) => {
      if (shuttingDown) return;

      shuttingDown = true;
      console.log(`${signal} received. Shutting down...`);

      server.close(async (error) => {
        try {
          await prisma.$disconnect();
        } catch (disconnectError) {
          console.error(
            "Database disconnect failed:",
            disconnectError
          );
          process.exitCode = 1;
        }

        if (error) {
          console.error("Server close failed:", error);
          process.exitCode = 1;
        }

        process.exit();
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));//click ctrl+c server stop
    process.once("SIGTERM", () => shutdown("SIGTERM"));

    server.on("error", (error) => {
      console.error("HTTP server error:", error);
      shutdown("SERVER_ERROR");
      process.exitCode = 1;
    });

  } catch (error) {
    console.error("Failed to start server:", error);

    await prisma.$disconnect().catch(() => {});
    process.exitCode = 1;
  }
}

void startServer();
