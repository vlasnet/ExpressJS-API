import 'reflect-metadata';
import { Container } from 'inversify';
import { UsersService } from './users.service';
import { TYPES } from '../types';
import type { IConfigService } from '../config/confige.service.interface';
import type { IUsersRepository } from './dto/users.repository.interface';
import type { IUserService } from './dto/users.service.interface';
import type { User } from './user.entity';
import type { UserModel } from '../../src/generated/prisma';

//TODO: In the current implementation, the environmental issue is not resolved.
// To run these test imports in the users.service.ts file should be changed to:
// import { User as NewUser } from './user.entity';
// import { TYPES } from '../types';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(() => 'mock-value'),
};

const UsersRepositoryMock: IUsersRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersService: IUserService;
let usersRepository: IUsersRepository;
let testUser: UserModel | null;

beforeAll(() => {
	container.bind<IUserService>(TYPES.UserService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersService = container.get<IUserService>(TYPES.UserService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockResolvedValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				id: 1,
				name: user.name,
				email: user.email,
				password: user.password,
			}),
		);

		testUser = await usersService.createUser({
			email: 'test@test.com',
			name: 'User',
			password: 'qwerty',
		});

		expect(testUser?.id).toEqual(1);
		expect(testUser?.password).not.toEqual('qwerty');
	});
	it('validateUser => Should return true email and password are correct', async () => {
		usersRepository.find = jest.fn().mockResolvedValueOnce(testUser);

		const validationResult = await usersService.validateUser({
			email: 'test@test.com',
			password: 'qwerty',
		});

		expect(validationResult).toBeTruthy();
	});
	it('validateUser => Should return false when password is wrong', async () => {
		usersRepository.find = jest.fn().mockResolvedValueOnce(testUser);

		const validationResult = await usersService.validateUser({
			email: 'testwrong@test.com',
			password: 'qwertyWrong',
		});

		expect(validationResult).toBeFalsy();
	});
	it('validateUser => Should return false when wrong user or user does not exist in the DB', async () => {
		usersRepository.find = jest.fn().mockResolvedValueOnce(null);

		const validationResult = await usersService.validateUser({
			email: 'testwrong@test.com',
			password: 'qwertyWrong',
		});

		expect(validationResult).toBeFalsy();
	});
});
