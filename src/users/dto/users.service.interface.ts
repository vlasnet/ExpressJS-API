import type { UserRegisterDto } from './user-register.dto.js';
import type { UserLoginDto } from './user-login.dto.js';
import type { UserModel } from '../../../src/generated/prisma';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
}
