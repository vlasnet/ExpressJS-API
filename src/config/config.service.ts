import type { IConfigService } from './confige.service.interface.js';
import { config, type DotenvConfigOutput, type DotenvParseOutput } from 'dotenv';
import { TYPES } from '../types.js';
import type { ILogger } from '../logger/logger.interface.js';
import { inject, injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('[ConfigService] Cannot read .env file or it does not exist');
		} else if (result.parsed) {
			this.logger.log('[ConfigService] Configuration .env uploaded');
			this.config = result.parsed;
		}
	}

	get(key: string): string {
		return this.config[key] as string;
	}
}
