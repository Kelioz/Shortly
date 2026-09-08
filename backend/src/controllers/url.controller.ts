import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { NotFoundError, UrlService } from "../services/url.service";

const shortenSchema = z.object({
  originalUrl: z.url().refine(
    (value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    },
    { message: "URL must use HTTP or HTTPS" },
  ),
});

const shortCodeSchema = z.string().regex(/^[A-Za-z0-9]{6,10}$/);

export class UrlController {
  constructor(private readonly service = new UrlService()) {}

  shorten = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { originalUrl } = shortenSchema.parse(request.body);
      response.status(201).json(await this.service.createShortUrl(originalUrl));
    } catch (error) {
      next(error);
    }
  };

  redirect = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const shortCode = shortCodeSchema.parse(request.params.shortCode);
      response.redirect(302, await this.service.resolveAndCount(shortCode));
    } catch (error) {
      next(error);
    }
  };

  stats = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const shortCode = shortCodeSchema.parse(request.params.shortCode);
      response.json(await this.service.getStats(shortCode));
    } catch (error) {
      next(error);
    }
  };
}

export { NotFoundError };
