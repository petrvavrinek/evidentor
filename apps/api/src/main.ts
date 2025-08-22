import { cors } from "@elysiajs/cors";
import { LoggerService } from "@evidentor/logging";
import { Elysia } from "elysia";

import { db } from "./database";
import env from "./env";
import { AuthRouter } from "./modules/auth";
import ClientsRouter from "./modules/clients";
import InvoicesRouter from "./modules/invoices";
import ProjectTaskRouter from "./modules/project-tasks";
import ProjectsRouter from "./modules/projects";
import TimeEntryRouter from "./modules/time-entries";
import CalendarRouter from "./modules/calendar";
import UserBillingRouter from "./modules/user-billing";

import { AddressResponse } from "./modules/addresses/addresses.schema";
import { pagination } from "./macros/pagination.macro";

const logger = new LoggerService("main");

const app = new Elysia()

	.use(
		cors({
			origin: env.CORS_ORIGINS ?? "*",
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(pagination)
	.onRequest((handler) => {
		logger.info(`[${handler.request.method}] ${handler.request.url}`);
	})
	.model("Address", AddressResponse)
	.use(AuthRouter)
	.use(ClientsRouter)
	.use(InvoicesRouter)
	.use(ProjectTaskRouter)
	.use(ProjectsRouter)
	.use(TimeEntryRouter)
	.use(CalendarRouter)
	.use(UserBillingRouter)
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

// Handle shutdown func
const handleShutdown = () => {
	logger.info("Closing server");
	app.stop(true);
	db.$client.end();
	process.exit(0);
};


// According to docs: graceful shutdown
// Source: https://hono.dev/docs/getting-started/nodejs
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

export type App = typeof app;
