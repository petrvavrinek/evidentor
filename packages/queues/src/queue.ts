import { Queue, type QueueOptions } from "bullmq";
import { createConnection } from "./create-connection";

type CreateQueueOptions = Omit<QueueOptions, "connection">;

/**
 * Create new queue
 * @param name Queue name
 * @param options Additional queue options
 * @returns 
 */
export const createQueue = <
	// biome-ignore lint/suspicious/noExplicitAny: Same as it is in bullmq
	DataTypeOrJob = any,
	// biome-ignore lint/suspicious/noExplicitAny: Same as it is in bullmq
	DefaultResultType = any,
	DefaultNameType extends string = string,
>(
	name: string,
	options?: CreateQueueOptions,
) => {
	const queue = new Queue<DataTypeOrJob, DefaultResultType, DefaultNameType>(
		name,
		{
			connection: createConnection(),
			...options,
		},
	);
	return queue;
};
