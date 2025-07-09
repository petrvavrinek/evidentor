import { render } from "@react-email/components";
import WelcomeEmail from "../emails/welcome-email";
import { sendMail } from "./transport";

import {
	createWorker,
	EmailQueue,
	type EmailQueueDataType,
	type EmailQueueResultType,
} from "@evidentor/queues";
import logger from "./logger";

const EmailWorker = createWorker<EmailQueueDataType, EmailQueueResultType>(
	EmailQueue.name,
	async (job) => {
		const { data } = job;
		logger.info(`Received job ${job.name}, event type: ${data.type}`);

		if (data.type === "welcome-email") {
			const rendered = await render(
				WelcomeEmail({
					user: { email: data.data.to, name: data.data.user.name },
				}),
			);

			await sendMail(data.data.to, "Welcome!", rendered);
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
