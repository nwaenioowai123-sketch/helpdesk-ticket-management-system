
import "dotenv/config";
import { z } from "zod";
//env correct or not???
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  DATABASE_URL: z
    .string()
    .startsWith("postgresql://"),

  CORS_ORIGIN: z
    .url()
    .default("http://localhost:5173"),
});
//error pya
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:",
    result.error.issues.map((issue) =>
      issue.path.join(".")
    )
  );

  throw new Error("Invalid environment variables");
}

export const env = result.data;
