export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
    description: "API для создания коротких ссылок и просмотра статистики переходов.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local server" }],
  tags: [{ name: "URLs", description: "Short URL operations" }],
  paths: {
    "/api/shorten": {
      post: {
        tags: ["URLs"],
        summary: "Create a short URL",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShortenRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Short URL created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ShortenResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
        },
      },
    },
    "/{shortCode}": {
      get: {
        tags: ["URLs"],
        summary: "Redirect to the original URL",
        parameters: [{ $ref: "#/components/parameters/ShortCode" }],
        responses: {
          "302": { description: "Redirect to the original URL" },
          "400": { $ref: "#/components/responses/BadRequest" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/api/stats/{shortCode}": {
      get: {
        tags: ["URLs"],
        summary: "Get short URL statistics",
        parameters: [{ $ref: "#/components/parameters/ShortCode" }],
        responses: {
          "200": {
            description: "Statistics",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StatsResponse" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    parameters: {
      ShortCode: {
        name: "shortCode",
        in: "path",
        required: true,
        schema: { type: "string", pattern: "^[A-Za-z0-9]{6}$", example: "abc123" },
      },
    },
    schemas: {
      ShortenRequest: {
        type: "object",
        required: ["originalUrl"],
        properties: {
          originalUrl: {
            type: "string",
            format: "uri",
            example: "https://example.com/articles/1",
          },
        },
      },
      ShortenResponse: {
        type: "object",
        required: ["shortCode", "shortUrl"],
        properties: {
          shortCode: { type: "string", example: "abc123" },
          shortUrl: { type: "string", format: "uri", example: "http://localhost:3000/abc123" },
        },
      },
      StatsResponse: {
        type: "object",
        required: ["originalUrl", "shortCode", "clicks", "createdAt"],
        properties: {
          originalUrl: { type: "string", format: "uri" },
          shortCode: { type: "string" },
          clicks: { type: "integer", minimum: 0 },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
      },
    },
    responses: {
      BadRequest: {
        description: "Invalid request",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      NotFound: {
        description: "Short code not found",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
    },
  },
} as const;
