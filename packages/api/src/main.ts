import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import env from "./env";
import logger from "./logger";

import { swagger } from "@elysiajs/swagger";
import { auth, OpenAPI } from "./auth";
import * as routers from "./routers";

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGINS ?? "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    swagger({
      documentation: {
        components: (await OpenAPI.components) as never,
        paths: (await OpenAPI.getPaths("/auth/api")) as never,
        openapi: "3.1.0",
      },
    }) as never
  )
  .onRequest((handler) => {
    // Print method as well
    logger.info(handler.request.url);
  })
  .mount(auth.handler)
  .use(routers.clientRouter)
  .use(routers.projectRouter)
  .use(routers.timeEntryRouter)
  .get("/status", () => {
    return "ok";
  });

// Quick overview about routes
logger.info("Defined routes:");

for (const route of app.routes) {
  const method = `[${route.method}]`.padEnd(8);
  logger.info(`\t${method} ${route.path}`);
}

app.listen(env.PORT);

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
