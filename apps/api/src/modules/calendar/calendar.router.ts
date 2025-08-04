import Elysia from "elysia";

import { betterAuth } from "../../auth";

export const router = new Elysia({
	prefix: "/calendar",
	detail: { tags: ["Calendar"] },
})
	.use(betterAuth)
	.get("", ({ user }) => {
    
  }, {
		auth: true,
	});
