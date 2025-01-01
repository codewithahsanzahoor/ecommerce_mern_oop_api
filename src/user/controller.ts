import errorHandler from "../middleware/error";
import { NextFunction, Request, Response } from "express";
import { User } from "./model";
import ErrorHandler from "../utils/errorHandler";
import { config } from "../config/config";
import sendEmail from "../utils/sendEmail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

interface CustomRequest extends Request {
	user: User;
}

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

		res.status(201).cookie("token", token, options).json({
			success: true,
			message: "User registered successfully",
			user,
			token,
		});
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
		res.status(200).cookie("token", token, options).json({
			success: true,
			message: "User logged in successfully",
			user,
			token,
		});
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

// forgot password functionality
const forgotPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			const Error = new ErrorHandler("User not found", 404);
			return next(errorHandler(Error, req, res, next));
		}

		// get reset password and token
		const resetToken = user.getResetPasswordToken();
		await user.save();

		// create reset password url and email to user
		const resetUrl = `${req.protocol}://${req.get(
			"host"
		)}/password/reset/${resetToken}`;
		const message = `Your password reset token is :- \n\n ${resetUrl} \n\nIf you have not requested this email then, please ignore it.`;
		try {
			await sendEmail(user.email, "Ecommerce Password Recovery", message);
			res.status(200).json({
				success: true,
				message: `Email sent to ${user.email} successfully`,
			});
		} catch (error: any) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();
			return next(errorHandler(error, req, res, next));
		}
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// reset password functionality
const resetPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const resetPasswordToken = crypto
			.createHash("sha256")
			.update(req.params.token)
			.digest("hex");

		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			const Error = new ErrorHandler(
				"Password reset token is invalid or has been expired",
				400
			);
			return next(errorHandler(Error, req, res, next));
		}

		if (req.body.password !== req.body.confirmPassword) {
			const Error = new ErrorHandler("Password does not match", 400);
			return next(errorHandler(Error, req, res, next));
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		// generating token and cookie for logged in user
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
		next(errorHandler(error, req, res, next));
	}
};

// get user details
const userDetails = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = (req as CustomRequest).user;
		res.status(200).json({ success: true, message: "User details", user });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// update password in db
const updatePassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userID = (req as CustomRequest).user;
		const user = await User.findById(userID._id).select("+password");
		const { oldPassword, newPassword } = req.body;
		// console.log("Old Password:", oldPassword);
		// console.log("user password:", user?.password);
		// console.log("New Password:", newPassword);
		if (!oldPassword || !newPassword) {
			const Error = new ErrorHandler(
				"Old password and new password are required",
				400
			);
			return next(errorHandler(Error, req, res, next));
		}
		if (!user) {
			const Error = new ErrorHandler("User not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		const isValidPassword = await bcrypt.compare(
			oldPassword,
			user.password
		);
		if (!isValidPassword) {
			const Error = new ErrorHandler("Old password is incorrect", 400);
			return next(errorHandler(Error, req, res, next));
		}
		user.password = newPassword;
		await user?.save();

		// generating token and cookie for logged in user
		const token = user?.getJWTToken();
		const options = {
			expires: new Date(
				Date.now() + parseInt(config.JWT_EXPIRE) * 24 * 60 * 60 * 1000
			),
		};
		res.status(200).cookie("token", token, options).json({
			success: true,
			message: "Password updated successfully",
			user,
			token,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// update user profile
const updateUserProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userID = (req as CustomRequest).user;
		const user = await User.findById(userID._id);
		if (!user) {
			const Error = new ErrorHandler("User not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		if (req.body.name) {
			user.name = req.body.name;
		}
		if (req.body.email) {
			user.email = req.body.email;
		}
		if (req.body.avatar) {
			user.avatar = req.body.avatar;
		}
		await user.save();
		res.status(200).json({ success: true, message: "User updated", user });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// ! admin routes controllers
// update user role
const updateRole = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		// const userID = (req as CustomRequest).user;
		const user = await User.findById(id);
		if (!user) {
			const Error = new ErrorHandler("User not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		user.role = req.body.role;
		user.name = req.body.name;
		user.email = req.body.email;
		await user.save();
		res.status(200).json({
			success: true,
			message: "User role updated",
			user,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// get all users details
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.find();
		res.status(200).json({ success: true, message: "Users", users });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// admin user details
const adminUserDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userID = (req as CustomRequest).user;
		const user = await User.findById(userID._id);
		res.status(200).json({ success: true, message: "User details", user });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// single user details
const singleUserDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		res.status(200).json({ success: true, message: "User details", user });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// delete user
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "User deleted", user });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

export {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	userDetails,
	updatePassword,
	updateUserProfile,
	updateRole,
	getAllUsers,
	adminUserDetails,
	singleUserDetails,
	deleteUser,
};
