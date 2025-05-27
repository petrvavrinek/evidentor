import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";
import logger from "./logger";

import { userApp } from "./routers/user.router";
import env from "./env";

import { type AuthType, auth } from "./auth";

const app = new Hono<{ Bindings: AuthType }>().route("/user", userApp);

// Bind auth routes
app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

const server = serve(app, ({ address, port }) => {
  logger.info(`Server listening on ${address}:${port}`);
});

if (env.IsDevelopment) {
  app.use(
    "/openapi",
    openAPISpecs(app, {
      documentation: {
        info: {
          title: "Evidentor API",
          version: "0.0.1",
        },
      },
    })
  );
  logger.info("OpenAPI registered");

  app.use("/openapi/ui", swaggerUI({ url: "/openapi" }));
  logger.info("Swagger endpoint registered");
}

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
