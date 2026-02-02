import { inject, injectable } from 'inversify';
import type { User } from './user.entity.js';
import { User as NewUser } from './user.entity.js';
import { TYPES } from '../types.js';
import type { IUserService } from './dto/users.service.interface.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import type { IConfigService } from '../config/confige.service.interface.js';

@injectable()
export class UsersService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const salt = Number(this.configService.get('SALT'));
		const newUser = new NewUser(email, name);
		await newUser.setPassword(password, salt);

		return null;
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
