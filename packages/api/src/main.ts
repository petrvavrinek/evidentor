import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import pkg from "../package.json";

import { OpenAPI } from "./auth/auth.openapi";
import env from "./env";
import logger from "./logger";

import { routers } from "./routers";

const app = new Elysia().use(
  swagger({
    documentation: {
      components: await OpenAPI.components,
      paths: await OpenAPI.getPaths(),
      info: {
        title: "Evidentor API",
        version: pkg.version,
      },
    },
  })
);

for (const router of routers) app.use(router);

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

export type AppType = typeof app;
