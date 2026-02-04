import { inject, injectable } from 'inversify';
import { User as NewUser } from './user.entity.js';
import { TYPES } from '../types.js';
import type { IUserService } from './dto/users.service.interface.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import type { IConfigService } from '../config/confige.service.interface.js';
import type { IUsersRepository } from './dto/users.repository.interface';
import type { UserModel } from '../../src/generated/prisma';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const salt = Number(this.configService.get('SALT'));
		const newUser = new NewUser(email, name);
		await newUser.setPassword(password, salt);
		const existedUser = await this.usersRepository.find(email);

		if (existedUser) {
			return null;
		}
		return await this.usersRepository.create(newUser);
	}
	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(email);
		if (!existedUser) {
			return false;
		}
		const newUser = new NewUser(existedUser.email, existedUser.name, existedUser.password);
		return await newUser.comparePassword(password);
	}

	async getUserInfo(email: string): Promise<UserModel | null> {
		return this.usersRepository.find(email);
	}
}
