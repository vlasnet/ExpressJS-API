import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller.js';
import type { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.js';
import type { ILogger } from '../logger/logger.interface.js';
import { TYPES } from '../types.js';
import type { IUserController } from './users.controller.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
			},
		]);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		// this.ok(res, 'Login');
		next(new HTTPError(401, 'Not Authorized', 'login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, 'Register');
	}
}
