import { Prisma, Url } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class UrlRepository {
  findByShortCode(shortCode: string): Promise<Url | null> {
    return prisma.url.findUnique({ where: { shortCode } });
  }

  create(data: Prisma.UrlCreateInput): Promise<Url> {
    return prisma.url.create({ data });
  }

  incrementClicks(shortCode: string): Promise<Url> {
    return prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } },
    });
  }
}
