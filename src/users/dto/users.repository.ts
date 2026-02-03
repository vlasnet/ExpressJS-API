import { inject, injectable } from 'inversify';
import { TYPES } from '../../types.js';
import type { IUsersRepository } from './users.repository.interface';
import type { User } from '../user.entity';
import type { UserModel } from '../../../src/generated/prisma';
import type { PrismaService } from '../../database/prisma.service';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ email, password, name }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({ where: { email } });
	}
}
