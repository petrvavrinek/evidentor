import { type Processor, Worker } from "bullmq";
import { envConfig } from "./config";

type CreateWorkerOptions = Omit<WorkerOptions, "connection">;

/**
 * Create new worker
 * @param name Queue name
 * @param processor Processor function
 * @param options Additional worker options
 * @returns Worker
 */
export const createWorker = <
	// biome-ignore lint/suspicious/noExplicitAny: Same as it is in bullmq
	DataType = any,
	// biome-ignore lint/suspicious/noExplicitAny: Same as it is in bullmq
	ResultType = any,
	NameType extends string = string,
>(
	name: string,
	processor: Processor<DataType, ResultType, NameType>,
	options?: CreateWorkerOptions,
) => {
	const worker = new Worker<DataType, ResultType, NameType>(name, processor, {
		connection: {
			host: envConfig.REDIS_HOST,
			port: envConfig.REDIS_PORT,
			username: envConfig.REDIS_USER,
			password: envConfig.REDIS_PASSWORD,
		},
		...options,
	});
	return worker;
};

