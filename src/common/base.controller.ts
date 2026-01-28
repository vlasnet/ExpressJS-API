import {Router, type Response} from 'express';
import type { IControllerRoute } from './route.interface.js';
import type { ILogger } from '../logger/logger.interface.js';

export abstract class BaseController {
    private readonly _router: Router;

    protected constructor( private logger: ILogger) {
        this._router = Router();
    }

    get router () {
        return this._router;
    }

    public send<T>(res: Response, code: number,  message: T) {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        return this.send<T>(res, 200, message);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IControllerRoute[]) {
        for(const route of routes) {
            const handler = route.func.bind(this);

            this.logger.log(`[${route.method}] ${route.path}`);
            this.router[route.method](route.path, handler);
        }
    }
}
