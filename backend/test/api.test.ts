import request from "supertest";
import { Prisma } from "@prisma/client";

const redisGet = jest.fn();
const redisSetex = jest.fn();
const incrementClicks = jest.fn();
const findByShortCode = jest.fn();
const create = jest.fn();

jest.mock("../src/lib/redis", () => ({
  redis: {
    get: redisGet,
    setex: redisSetex,
    on: jest.fn(),
    disconnect: jest.fn(),
  },
}));

jest.mock("../src/lib/prisma", () => ({
  prisma: {
    url: {
      findUnique: findByShortCode,
      create,
      update: incrementClicks,
    },
    $disconnect: jest.fn(),
  },
}));

import { app } from "../src/app";

describe("URL API", () => {
  beforeEach(() => {
    redisGet.mockReset();
    redisSetex.mockReset();
    incrementClicks.mockReset();
    findByShortCode.mockReset();
    create.mockReset();
    redisSetex.mockResolvedValue("OK");
    incrementClicks.mockResolvedValue({});
  });

  it("creates a short URL for a valid HTTP URL", async () => {
    create.mockResolvedValue({ shortCode: "abc123" });

    const response = await request(app)
      .post("/api/shorten")
      .send({ originalUrl: "https://example.com/page" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      shortCode: "abc123",
      shortUrl: "http://localhost:3000/abc123",
    });
  });

  it("rejects non-HTTP URLs", async () => {
    const response = await request(app)
      .post("/api/shorten")
      .send({ originalUrl: "ftp://example.com/file" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid request");
    expect(create).not.toHaveBeenCalled();
  });

  it("redirects from a cached URL and increments clicks", async () => {
    redisGet.mockResolvedValue("https://example.com/page");

    const response = await request(app).get("/abc123").redirects(0);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("https://example.com/page");
    expect(incrementClicks).toHaveBeenCalledWith({
      where: { shortCode: "abc123" },
      data: { clicks: { increment: 1 } },
    });
    expect(findByShortCode).not.toHaveBeenCalled();
  });

  it("loads a URL from the database and caches it on a cache miss", async () => {
    redisGet.mockResolvedValue(null);
    findByShortCode.mockResolvedValue({
      originalUrl: "https://example.com/from-db",
      shortCode: "abc123",
    });

    const response = await request(app).get("/abc123").redirects(0);

    expect(response.status).toBe(302);
    expect(findByShortCode).toHaveBeenCalledWith({
      where: { shortCode: "abc123" },
    });
    expect(redisSetex).toHaveBeenCalledWith(
      "url:abc123",
      3600,
      "https://example.com/from-db",
    );
    expect(incrementClicks).toHaveBeenCalled();
  });

  it("regenerates the code after a unique collision", async () => {
    const collision = new Prisma.PrismaClientKnownRequestError("Unique constraint", {
      code: "P2002",
      clientVersion: "6.19.3",
    });
    create
      .mockRejectedValueOnce(collision)
      .mockResolvedValueOnce({ shortCode: "def456" });

    const randomSpy = jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValue(0.1);

    const response = await request(app)
      .post("/api/shorten")
      .send({ originalUrl: "https://example.com/collision" });

    randomSpy.mockRestore();
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[0][0].data.shortCode).not.toBe(
      create.mock.calls[1][0].data.shortCode,
    );
  });

  it("rejects a redirect target pointing back to the same short URL", async () => {
    redisGet.mockResolvedValue("http://localhost:3000/abc123");

    const response = await request(app).get("/abc123");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Redirect target cannot point to the same short URL",
    );
    expect(incrementClicks).not.toHaveBeenCalled();
  });

  it("returns 404 for an unknown short code", async () => {
    redisGet.mockResolvedValue(null);
    findByShortCode.mockResolvedValue(null);

    const response = await request(app).get("/abc123");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Short code not found" });
  });

  it("returns statistics for an existing short code", async () => {
    const createdAt = new Date("2026-01-01T12:00:00.000Z");
    findByShortCode.mockResolvedValue({
      originalUrl: "https://example.com/page",
      shortCode: "abc123",
      clicks: 3,
      createdAt,
    });

    const response = await request(app).get("/api/stats/abc123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      originalUrl: "https://example.com/page",
      shortCode: "abc123",
      clicks: 3,
      createdAt: createdAt.toISOString(),
    });
  });
});
