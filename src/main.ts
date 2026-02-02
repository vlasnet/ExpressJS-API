import { Container, ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import { UserController } from './users/users.controller.js';
import { LoggerService } from './logger/logger.service.js';
import { UsersService } from './users/users.service.js';
import { ConfigService } from './config/config.service.js';
import { TYPES } from './types.js';
import type { ILogger } from './logger/logger.interface.js';
import type { IExceptionFilter } from './errors/exception.filter.interface.js';
import type { IUserService } from './users/dto/users.service.interface.js';
import type { IUserController } from './users/users.controller.interface.js';
import type { IConfigService } from './config/confige.service.interface.js';

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	options.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	options.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	options.bind<IUserService>(TYPES.UserService).to(UsersService).inSingletonScope();
	options.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	options.bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
