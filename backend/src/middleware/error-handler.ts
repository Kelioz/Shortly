import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { CyclicRedirectError, NotFoundError } from "../services/url.service";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Invalid request",
      details: error.issues.map((issue) => issue.message),
    });
    return;
  }

  if (error instanceof NotFoundError) {
    response.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof CyclicRedirectError) {
    response.status(400).json({ error: error.message });
    return;
  }

  console.error("Unhandled error:", error);
  response.status(500).json({ error: "Internal server error" });
};
