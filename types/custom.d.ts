/*
The extension of the Request interface for Express from this file (custom.d.ts) does not work in this configuration. Calls to req.user fail at runtime with the error
[Object: null prototype] { Symbol(nodejs.util.inspect.custom): [Function: [nodejs.util.inspect.custom]] },
but the TypeScript check passes successfully without any errors.
*/

declare module 'express-serve-static-core' {
	interface Request {
		user?: string;
	}
}

export {};
