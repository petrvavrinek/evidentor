import { render } from "@react-email/components";
import { sendMail } from "./transport";

import {
	createWorker,
	EmailQueue,
	type EmailQueueDataType,
	type EmailQueueResultType,
} from "@evidentor/queues";
import logger from "./logger";

import WelcomeEmail from "../emails/welcome-email";
import VerificationEmail from "../emails/verification-email";
import { envConfig } from "./config";
import PasswordResetEmail from "../emails/password-reset-email";

const EmailWorker = createWorker<EmailQueueDataType, EmailQueueResultType>(
	EmailQueue.name,
	async (job) => {
		const { data } = job;
		logger.info(`Received job ${job.name}, event type: ${data.type}`);

		switch (data.type) {
			case "welcome-email": {
				const rendered = await render(
					WelcomeEmail({
						user: { email: data.data.to, name: data.data.user.name },
					}),
				);

				await sendMail(data.data.to, "Welcome!", rendered);

				break;
			}
			case "verification-email": {
				const verificationLink = `${envConfig.FRONTEND_URL}/auth/verify?token=${data.data.token}`;
				const rendered = await render(
					VerificationEmail({
						verificationLink,
						user: { email: data.data.to, name: data.data.user.name },
					}),
				);

				await sendMail(data.data.to, "Account verification", rendered);
				break;
			}

			case "password-reset": {
				const passwordResetLink = `${envConfig.FRONTEND_URL}/auth/password-reset?token=${data.data.token}`;
				const rendered = await render(
					PasswordResetEmail({
						passwordResetLink,
						user: { email: data.data.to, name: data.data.user.name },
					}),
				);

				await sendMail(data.data.to, "Password reset", rendered);
				break;
			}
		}

		return { ok: true };
	},
);

const server = Bun.serve({
	routes: {
		"/status": new Response("OK"),
	},
	port: process.env.PORT ?? 3000,
	hostname: "0.0.0.0",
});

logger.info(`Listening for healthchecks on ${server.hostname}:${server.port}`);
logger.info(`Connected and waiting for jobs...`);
