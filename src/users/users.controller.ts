import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { BaseController } from '../common/base.controller.js';
import { ValidateMiddleware } from '../common/validate.middleware.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import { UserRegisterDto as DtoUserRegister } from './dto/user-register.dto.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import { UserLoginDto as DtoUserLogin } from './dto/user-login.dto.js';
import { HTTPError } from '../errors/http-error.js';
import { TYPES } from '../types.js';
import type { NextFunction, Request, Response } from 'express';
import type { ILogger } from '../logger/logger.interface.js';
import type { AuthenticatedRequest, IUserController } from './users.controller.interface.js';
import type { IConfigService } from '../config/confige.service.interface';
import type { IUserService } from './dto/users.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [],
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
			this.loggerService.log('Success login at ' + new Date().toISOString());
			const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
			this.ok(res, { jwt });
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

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: (req as AuthenticatedRequest).user });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						reject(err);
					} else if (token) {
						resolve(token);
					}
				},
			);
		});
	}
}
