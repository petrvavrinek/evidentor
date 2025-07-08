import "dotenv/config";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "../database";
import * as authSchema from "../db/auth.schema";
import env from "../env";

import { EmailQueue } from "@evidentor/queues";
import logger from "../logger";

export const auth = betterAuth({
	basePath: "/auth",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	trustedOrigins: ["*"],

	plugins: [
		openAPI(),
		// organization({
		//   // Enable teams with 1 default
		//   teams: {
		//     enabled: true,
		//     maximumTeams: 1,
		//     allowRemovingAllTeams: false,
		//     defaultTeam: {
		//       enabled: true,
		//     },
		//   },
		// }),
	],
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
		},
		ipAddress: {
			ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for", "x-real-ip"],
		},
	},
	user: {
		changeEmail: {
			enabled: false,
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},

	databaseHooks: {
		user: {
			create: {
				after: async (user, context) => {
					logger.info(`Sending welcome email to ${user.email}`);
					await EmailQueue.add("welcome", {
						type: "welcome-email",
						data: { to: user.email, user: { name: user.name } },
					});
				},
			},
		},
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
