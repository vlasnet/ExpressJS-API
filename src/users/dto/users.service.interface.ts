import type { UserRegisterDto } from './user-register.dto.js';
import type { User } from '../user.entity.js';
import type { UserLoginDto } from './user-login.dto.js';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
