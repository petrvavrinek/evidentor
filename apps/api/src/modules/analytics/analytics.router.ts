import Elysia from "elysia";

import { betterAuth } from "../../auth";

export const router = new Elysia({
	prefix: "/analytics",
	detail: { tags: ["Analytics"] },
})
	.use(betterAuth)
	.get(
		"",
		async ({ user }) => {
      

			return {};
		},
		{
			auth: true,
			detail: {
				description: "Get all user-defined clients",
			},
		},
	);
