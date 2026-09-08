import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 2,
});

redis.on("error", (error: Error) => {
  console.error("Redis error:", error.message);
});
