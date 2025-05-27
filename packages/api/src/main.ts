import { serve } from "@hono/node-server";
import { Hono } from "hono";

import logger from "./logger";

import { userApp } from "./routers/user.router";

const app = new Hono().route("/user", userApp);

const server = serve(app, ({ address, port }) => {
  logger.info(`Server listening on ${address}:${port}`);
});

// According to docs: graceful shutdown
// Source: https://hono.dev/docs/getting-started/nodejs
process.on("SIGINT", () => {
  logger.info("Closing server");
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    logger.error(`Closing server due to error ${err}`);
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});

export type AppType = typeof app;