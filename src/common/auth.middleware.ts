import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { IMiddleware } from './middleware.interface';
import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedRequest } from '../users/users.controller.interface';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ').at(1) ?? '';
			jwt.verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					(req as AuthenticatedRequest).user = (payload as JwtPayload).email;
					next();
				}
			});
		}
		next();
	}
}
