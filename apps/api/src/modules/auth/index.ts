import swagger from "@elysiajs/swagger";
import Elysia from "elysia";

import { OpenAPI } from "./auth.openapi";
import { auth } from "./better-auth";

/**
 * Elysia app with better-auth support
 */
export const AuthRouter = new Elysia()
	.all("/auth/*", (ctx) => {
		if (["POST", "GET"].includes(ctx.request.method))
			return auth.handler(ctx.request);
		ctx.status(405);
	}, { parse: "none" })
	.use(
		swagger({
			documentation: {
				components: (await OpenAPI.components) as never,
				paths: (await OpenAPI.getPaths("/auth")) as never,
				openapi: "3.1.0",
			},
		}) as never,
	);

export { BetterAuthMacro } from "./auth.middleware";
// IDEA: Rename this so its not named "auth"?
export { auth } from "./better-auth";
