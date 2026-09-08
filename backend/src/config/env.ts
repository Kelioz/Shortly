import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  BASE_URL: z.string().url().transform((value) => value.replace(/\/+$/, "")),
  REDIS_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
});

export const env = envSchema.parse(process.env);
