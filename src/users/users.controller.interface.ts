import type { NextFunction, Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
	user: string;
}

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
