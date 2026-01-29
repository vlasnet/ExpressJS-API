import 'reflect-metadata';
import { injectable } from 'inversify';
import type { ILogObj } from 'tslog';
import { Logger } from 'tslog';
import type { ILogger } from './logger.interface.js';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({
			hideLogPositionForProduction: true,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
