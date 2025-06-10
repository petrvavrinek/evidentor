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
      origin: "http://localhost:3001",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    swagger({
      documentation: {
        components: await OpenAPI.components as never,
        paths: await OpenAPI.getPaths("/auth/api") as never,
      },
    })
  )
  .onRequest((handler) => {
    console.log(handler.request.url);
  })
  .mount(auth.handler)
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
