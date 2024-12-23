import { NextFunction, Request, Response } from "express";
import errorHandler from "../middleware/error";
import ErrorHandler from "../utils/errorHandler";
import { config } from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../user/model";

interface CustomRequest extends Request {
	user: any;
}

// Check if user is logged in or not
async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.cookies && req.cookies.token) {
		const decoded = jwt.verify(
			req.cookies.token,
			config.JWT_SECRET as string
		) as JwtPayload;
		(req as CustomRequest).user = await User.findById(decoded._id);
		// console.log(decoded);
		return next();
	} else {
		const Error = new ErrorHandler("Invalid email or password", 400);
		return next(errorHandler(Error, req, res, next));
	}
}

// Check if user is admin or not
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

export { isAuthenticated, authorizeRoles };
