import { NextFunction, Request, Response } from "express";

import ErrorHandler from "../utils/errorHandler";

const errorHandler = (
	err: ErrorHandler,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	err.statusCode = err.statusCode || 500;
	err.message = err.message || "Internal Server Error";

	res.status(err.statusCode).json({
		success: false,
		message: err.message,
		errorStack: err.stack,
	});

	return next();
};

export default errorHandler;
