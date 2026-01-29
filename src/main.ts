import { Container, ContainerModule, type ContainerModuleLoadOptions } from 'inversify';
import { App } from './app.js';
import { ExceptionFilter } from './errors/exception.filter.js';
import type { UserController } from './users/users.controller.js';
import { UserController as Users } from './users/users.controller.js';
import { LoggerService } from './logger/logger.service.js';
import type { ILogger } from './logger/logger.interface.js';
import { TYPES } from './types.js';
import type { IExceptionFilter } from './errors/exception.filter.interface.js';

interface IBootstrapReturn {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((options: ContainerModuleLoadOptions) => {
	options.bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	options.bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	options.bind<UserController>(TYPES.UserController).to(Users).inSingletonScope();
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
