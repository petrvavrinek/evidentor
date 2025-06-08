import pkg from "../package.json";

import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import env from "./env";
import logger from "./logger";

import { auth, OpenAPI } from "./auth";
import * as routers from "./routers";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
  .onRequest(handler => {
    console.log(handler.request.url);
  })
  .mount("/api/auth", auth.handler)
  .use(routers.clientRouter)
  .use(routers.projectRouter)
  .use(routers.timeEntryRouter);

app.listen(env.PORT);

console.log(app.routes.map((e) => e.path));

logger.info(`Server running at :${env.PORT}`);

// According to docs: graceful shutdown
// Source: https://hono.dev/docs/getting-started/nodejs
process.on("SIGINT", () => {
  logger.info("Closing server");
  app.stop(true);
  process.exit(0);
});
process.on("SIGTERM", () => {
  app.stop(true);
  process.exit(0);
});

export type App = typeof app;
