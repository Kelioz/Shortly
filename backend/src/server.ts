import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { redis } from "./lib/redis";

const server = app.listen(env.PORT, () => {
  console.info(`Backend listening on ${env.BASE_URL}`);
});

const shutdown = async (signal: string) => {
  console.info(`Received ${signal}, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
