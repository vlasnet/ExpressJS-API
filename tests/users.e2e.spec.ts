import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

//TODO: In the current implementation, the environmental issue is not resolved.
// To run these test imports extension of many files should be without .js

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'test@gmail.com', password: 'qwerty' });

		expect(res.statusCode).toBe(422);
	});
	it('Login - success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: 'qwerty' });

		expect(res.statusCode).toBe(200);
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Login - error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: 'qwertyWrong' });

		expect(res.statusCode).toBe(401);
	});
	it('Info - success', async () => {
		const loginRes = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: 'qwerty' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${loginRes.body.jwt}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ id: 1, name: 'test-user', email: 'test@gmail.com' });
	});
	it('Info - error', async () => {
		const loginRes = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: 'qwerty' });
		const res = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${loginRes.body.jwt}WRONG`);

		expect(res.statusCode).toBe(401);
	});
});

afterAll(() => {
	application.close();
});
