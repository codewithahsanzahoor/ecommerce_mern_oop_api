import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/errorHandler";
import { config } from "../config/config";

const errorHandler = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	if (!res.headersSent) {
		res.status(err.statusCode).json({
			success: false,
			message: err.message,
			errorStack: config.env === "development" ? err.stack : null,
		});
	}

	return next();
};

export default errorHandler;
