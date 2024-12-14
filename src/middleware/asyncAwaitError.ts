import { Request, Response, NextFunction } from "express";

type ExpressMiddlewareFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any> | any;

export const middlewareWrapper =
	(theFunc: ExpressMiddlewareFunction) =>
	(req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(theFunc(req, res, next)).catch(next);
	};

export default middlewareWrapper;
