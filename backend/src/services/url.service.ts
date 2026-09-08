import { Prisma } from "@prisma/client";
import { env } from "../config/env";
import { redis } from "../lib/redis";
import { UrlRepository } from "../repositories/url.repository";

const CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 6;
const MAX_CREATE_ATTEMPTS = 5;

export class NotFoundError extends Error {
  constructor(message = "Short code not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UrlService {
  constructor(private readonly repository = new UrlRepository()) {}

  async createShortUrl(originalUrl: string) {
    for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt += 1) {
      try {
        const shortCode = this.generateCode();
        const url = await this.repository.create({ originalUrl, shortCode });
        return {
          shortCode: url.shortCode,
          shortUrl: `${env.BASE_URL}/${url.shortCode}`,
        };
      } catch (error) {
        if (!this.isUniqueViolation(error) || attempt === MAX_CREATE_ATTEMPTS - 1) {
          throw error;
        }
      }
    }

    throw new Error("Unable to generate a unique short code");
  }

  async resolveAndCount(shortCode: string): Promise<string> {
    const cacheKey = this.cacheKey(shortCode);
    let originalUrl = await redis.get(cacheKey);

    if (originalUrl) {
      console.info(`URL cache hit: ${shortCode}`);
    } else {
      const url = await this.repository.findByShortCode(shortCode);
      if (!url) {
        throw new NotFoundError();
      }
      originalUrl = url.originalUrl;
      await redis.setex(cacheKey, env.REDIS_TTL_SECONDS, originalUrl);
      console.info(`URL cache miss: ${shortCode}`);
    }

    await this.repository.incrementClicks(shortCode);
    return originalUrl;
  }

  getStats(shortCode: string) {
    return this.repository.findByShortCode(shortCode).then((url) => {
      if (!url) {
        throw new NotFoundError();
      }
      return {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
      };
    });
  }

  private generateCode(): string {
    return Array.from({ length: CODE_LENGTH }, () => {
      const index = Math.floor(Math.random() * CODE_ALPHABET.length);
      return CODE_ALPHABET[index];
    }).join("");
  }

  private cacheKey(shortCode: string): string {
    return `url:${shortCode}`;
  }

  private isUniqueViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
  }
}
