import type { IUserService } from './dto/users.service.interface.js';
import type { UserRegisterDto } from './dto/user-register.dto.js';
import type { UserLoginDto } from './dto/user-login.dto.js';
import type { User } from './user.entity.js';
import { User as NewUser } from './user.entity.js';
import { injectable } from 'inversify';

@injectable()
export class UsersService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new NewUser(email, name);
		await newUser.setPassword(password);

		return null;
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
