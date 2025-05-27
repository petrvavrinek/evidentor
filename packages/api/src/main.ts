import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";

import { OpenAPI } from "./auth.openapi";
import logger from "./logger";

import { auth } from "./auth";

const app = new Elysia()
  .mount(auth.handler)
  .use(
    swagger({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .get("/", (c) => {
    return "OK";
  })
  .listen(3000);

logger.info("Server running at 3000");

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

export type AppType = typeof app;
