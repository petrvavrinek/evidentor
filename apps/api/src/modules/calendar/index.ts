import Elysia from "elysia";
import { BetterAuthMacro } from "../auth";
import { CalendarService } from "./calendar.service";

const router = new Elysia({
	prefix: "/calendar",
	detail: { tags: ["Calendar"] },
})
	.use(BetterAuthMacro)
	.get(
		"",
		({ user }) => {
			return CalendarService.findByUser(user.id);
		},
		{
			auth: true,
		},
	);

export default router;
