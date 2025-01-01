import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./errorHandler";
import errorHandler from "../middleware/error";
import { User } from "../user/model";

interface CustomRequest extends Request {
	user: User;
}

function authorizeRoles(...roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes((req as CustomRequest).user.role)) {
			const Error = new ErrorHandler(
				`${(req as CustomRequest).user.role} not allowed`,
				403
			);
			return next(errorHandler(Error, req, res, next));
		}
		return next();
	};
}

export default authorizeRoles;
