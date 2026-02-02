import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString({ message: 'Password is undefined' })
	password: string;

	@IsString({ message: 'Name is undefined' })
	name: string;
}
