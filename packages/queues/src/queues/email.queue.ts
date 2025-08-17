import { QueueEvents } from "bullmq";
import { createQueue } from "../queue";

type EmailQueueEvent<Event extends string, Data> = {
	type: Event;
	data: Data;
};

// Queue data types
export type EmailQueueDataType =
	| EmailQueueEvent<"welcome-email", { to: string; user: { name: string } }>
	| EmailQueueEvent<
			"verification-email",
			{ to: string; user: { name: string }; token: string }
	  >
	| EmailQueueEvent<
			"password-reset",
			{ to: string; user: { name: string }; token: string }
	  >;

export type EmailQueueResultType = {
	ok: boolean;
};

// Define queues here at the moment
export const EmailQueue = createQueue<
	EmailQueueDataType,
	EmailQueueResultType,
	"welcome"
>("Emails");
