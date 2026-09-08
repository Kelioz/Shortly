import cors from "cors";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { UrlController } from "./controllers/url.controller";
import { errorHandler } from "./middleware/error-handler";
import { openApiDocument } from "./openapi";

const app = express();
const controller = new UrlController();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.get("/docs.json", (_request, response) => {
  response.json(openApiDocument);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.post("/api/shorten", controller.shorten);
app.get("/api/stats/:shortCode", controller.stats);
app.get("/:shortCode", controller.redirect);
app.use(errorHandler);

export { app };
