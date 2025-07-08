import { createQueue } from "./queue";

export type EmailQueueDataType = {
	type: "welcome-email";
	data: {
		to: string;
		user: {
			name: string;
		};
	};
};

export type EmailQueueResultType = {
	ok: boolean;
};

// Define queues here at the moment
export const EmailQueue = createQueue<
	EmailQueueDataType,
	EmailQueueResultType,
	"welcome"
>("Emails");

