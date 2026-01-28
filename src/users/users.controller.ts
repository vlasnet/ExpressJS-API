import { BaseController } from '../common/base.controller.js';
import type { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../errors/http-error.js';
import type { ILogger } from '../logger/logger.interface.js';

export class UserController extends BaseController {
    constructor(logger: ILogger) {
        super(logger);
        this.bindRoutes([{
            path: '/register',
            method: 'post',
            func: this.register,
        },{
            path: '/login',
            method: 'post',
            func: this.login,
        }])
    }

    login(req: Request, res: Response, next: NextFunction) {
        // this.ok(res, 'Login');
        next(new HTTPError(401, 'Not Authorized', 'login'));
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'Register');
    }
}
