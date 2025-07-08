import { render } from "@react-email/components";
import WelcomeEmail from "../emails/welcome-email";
import { sendMail } from "./transport";

import {
	createWorker,
	EmailQueue,
	type EmailQueueDataType,
	type EmailQueueResultType,
} from "@evidentor/queues";

const EmailWorker = createWorker<EmailQueueDataType, EmailQueueResultType>(
	EmailQueue.name,
	async (job) => {
		const { data } = job;

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
