import { Elysia } from "elysia";

import { auth } from "./better-auth";

// User middleware (compute user and session and pass to routes)
export const BetterAuthMacro = new Elysia({ name: "better-auth" }).macro({
	auth: {
		async resolve({ status, request: { headers } }) {
			const session = await auth.api.getSession({
				headers,
			});

			if (!session) return status(401);

			return {
				user: session.user,
				session: session.session,
			};
		},
	},
});
