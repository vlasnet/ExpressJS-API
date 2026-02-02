import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import type { Express } from 'express';
import express, { json, urlencoded } from 'express';
import { TYPES } from './types.js';
import type { Server } from 'http';
import type { UserController } from './users/users.controller.js';
import type { IExceptionFilter } from './errors/exception.filter.interface.js';
import type { ILogger } from './logger/logger.interface.js';
import type { IConfigService } from './config/confige.service.interface.js';
import type { PrismaService } from './database/prisma.service.js';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started on http://localhost:${this.port}`);
	}
}
