import { inject, injectable } from 'inversify';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.js';
import { TYPES } from '../types.js';
import type { ILogger } from '../logger/logger.interface.js';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const adapter = new PrismaBetterSqlite3({
			url: 'file:./prisma/dev.db',
		});
		this.client = new PrismaClient({ adapter });
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] DB connected via Prisma');
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(
					'[PrismaService] An error occured whil trying to connect to DB: ' + e.message,
				);
			}
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
