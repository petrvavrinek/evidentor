import "dotenv/config";

import { EmailQueue } from "@evidentor/queues";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

import { db } from "../database";
import * as authSchema from "../db/auth.schema";
import env from "../env";
import logger from "../logger";

export const auth = betterAuth({
	basePath: "/auth",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async (data) => {
			logger.info(`Sending password reset email to ${data.user.email}`);
			await EmailQueue.add("welcome", {
				type: "password-reset",
				data: {
					to: data.user.email,
					token: data.token,
					user: { name: data.user.name },
				},
			});
		},
		resetPasswordTokenExpiresIn: 1000 * 60 * 60,
	},
	trustedOrigins: ["*"],
	plugins: [openAPI()],
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
	emailVerification: {
		sendVerificationEmail: async (data) => {
			logger.info(`Sending verification email to ${data.user.email}`);
			await EmailQueue.add("welcome", {
				type: "verification-email",
				data: {
					to: data.user.email,
					token: data.token,
					user: { name: data.user.name },
				},
			});
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 1000 * 60 * 60 * 24, // 24 hours
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
