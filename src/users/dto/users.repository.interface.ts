import type { User } from '../user.entity';
import type { UserModel } from '../../../src/generated/prisma';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
