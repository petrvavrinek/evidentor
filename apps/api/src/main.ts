import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import env from "./env";
import logger from "./logger";

import { auth, OpenAPI } from "./auth";
import * as routers from "./routers";



const app = new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGINS ?? "*",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(
		swagger({
			documentation: {
				components: (await OpenAPI.components) as never,
				paths: (await OpenAPI.getPaths("/auth")) as never,
				openapi: "3.1.0",
			},
		}) as never,
	)
	.onRequest((handler) => {
		logger.info(`[${handler.request.method}] ${handler.request.url}`);
	})
	.all("/auth/*", (context) => {
		if (["POST", "GET"].includes(context.request.method))
			return auth.handler(context.request);
		context.status(405);
	})
	.use(routers.clientRouter)
	.use(routers.projectRouter)
	.use(routers.timeEntryRouter)
	.use(routers.projectTasksRouter)
	.use(routers.invoicesRouter)
	.head("/status", () => "ok")
	.get("/status", () => "ok");

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
