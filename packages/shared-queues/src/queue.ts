import { Queue, type QueueOptions } from "bullmq";
import { envConfig } from "./config";

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
			connection: {
				host: envConfig.REDIS_HOST,
				port: envConfig.REDIS_PORT,
				username: envConfig.REDIS_USER,
				password: envConfig.REDIS_PASSWORD,
			},
			...options,
		},
	);
	return queue;
};
