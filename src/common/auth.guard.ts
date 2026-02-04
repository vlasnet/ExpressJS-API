import type { IMiddleware } from './middleware.interface';
import type { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (typeof req === 'object' && 'user' in req) {
			return next();
		}

		res.status(401).send({ error: 'Unauthorized' });
	}
}
