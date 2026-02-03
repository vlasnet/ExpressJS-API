import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import type { NextFunction, Request, Response } from 'express';
import { BaseController } from '../common/base.controller.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import { UserRegisterDto as DtoUserRegister } from './dto/user-register.dto.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import { UserLoginDto as DtoUserLogin } from './dto/user-login.dto.js';
import { UsersService } from './users.service.js';
import { TYPES } from '../types.js';
import { HTTPError } from '../errors/http-error.js';
import type { ILogger } from '../logger/logger.interface.js';
import type { IUserController } from './users.controller.interface.js';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UsersService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(DtoUserRegister)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(DtoUserLogin)],
			},
		]);
	}

	async login(
		{ body }: Request<unknown, unknown, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isSuccess = await this.userService.validateUser(body);
		if (isSuccess) {
			this.ok(res, {});
		} else {
			return next(new HTTPError(401, 'Not Authorized', 'login'));
		}
	}

	async register(
		{ body }: Request<unknown, unknown, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const newUser = await this.userService.createUser(body);

		if (!newUser) {
			return next(new HTTPError(422, 'User with this email or name has already exist'));
		}

		this.ok(res, { id: newUser.id, name: newUser.name, email: newUser.email });
	}
}
