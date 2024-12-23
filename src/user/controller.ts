import errorHandler from "../middleware/error";
import { NextFunction, Request, Response } from "express";
import { User } from "./model";
import ErrorHandler from "../utils/errorHandler";
import { config } from "../config/config";

const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, password } = req.body;
		const user = await User.create({
			name,
			email,
			password,
			avatar: {
				public_id: "public_id",
				url: "url",
			},
		});

		const token = user.getJWTToken();
		const options = {
			expires: new Date(
				Date.now() + parseInt(config.JWT_EXPIRE) * 24 * 60 * 60 * 1000
			),
		};

		res.status(201)
			.cookie("token", token, options)
			.json({ success: true, user, token });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = (await User.findOne({ email }).select(
			"+password"
		)) as User | null;
		if (!user) {
			const Error = new ErrorHandler("Invalid email or password", 400);
			return next(errorHandler(Error, req, res, next));
		}
		const isPasswordMatched = await user?.comparePassword(password);
		if (!isPasswordMatched) {
			const Error = new ErrorHandler("Invalid email or password", 400);
			return next(errorHandler(Error, req, res, next));
		}
		const token = user?.getJWTToken();
		const options = {
			expires: new Date(
				Date.now() + parseInt(config.JWT_EXPIRE) * 24 * 60 * 60 * 1000
			),
		};
		res.status(200)
			.cookie("token", token, options)
			.json({ success: true, user, token });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: "Logged out" });
};

export { registerUser, loginUser, logoutUser };
