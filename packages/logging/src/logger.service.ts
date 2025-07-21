import pretty from "pino-pretty";
import pino from "pino";

import type { ILogger, SerializableLogType } from "./logger.interface";

/**
 * Simple service that log multiple types of objects into standard output/error output
 */
export class LoggerService implements ILogger {
	_logger: pino.Logger<never>;

	constructor(prefix: string) {
		const stream = pretty({
			colorize: true,
			ignore: "hostname,pid"
		});

		this._logger = pino({
			name: prefix,
		}, stream);
	}

	convertToString(...args: SerializableLogType[]): string {
		return args.join(" ");
	}

	debug(...args: SerializableLogType[]) {
		this._logger.debug(this.convertToString(...args));
	}

	error(...args: SerializableLogType[]) {
		this._logger.error(this.convertToString(...args));
	}

	info(...args: SerializableLogType[]) {
		this._logger.info(this.convertToString(...args));
	}

	warn(...args: SerializableLogType[]) {
		this._logger.info(this.convertToString(...args));
	}
}
