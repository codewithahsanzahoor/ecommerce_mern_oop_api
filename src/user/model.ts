import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import crypto from "crypto";

export interface User {
	name: string;
	email: string;
	password: string;
	avatar: {
		public_id: string;
		url: string;
	};
	role: string;
	createdAt: Date;
	resetPasswordToken: string | undefined;
	resetPasswordExpires: Date | undefined;
	getJWTToken(): string;
	comparePassword(password: string): Promise<boolean>;
	getResetPasswordToken(): string;
	save(): Promise<void>;
	_id: string;
}

const userSchema = new mongoose.Schema<User>({
	name: {
		type: String,
		required: [true, "Please enter user name"],
		maxLength: [30, "Name cannot exceed 30 characters"],
		minLength: [3, "Name must be at least 3 characters"],
	},
	email: {
		type: String,
		required: [true, "Please enter user email address"],
		unique: true,
		validate: [validator.isEmail, "Please enter a valid email address"],
	},
	password: {
		type: String,
		required: [true, "Please enter user password"],
		minLength: [6, "Password must be at least 6 characters"],
		select: false,
	},
	avatar: {
		public_id: {
			type: String,
			required: [true, "Please enter user avatar"],
		},
		url: {
			type: String,
			required: [true, "Please enter user avatar url"],
		},
	},
	role: {
		type: String,
		default: "user",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
	return jwt.sign({ _id: this._id }, config.JWT_SECRET as string, {
		expiresIn: config.JWT_EXPIRE,
	});
};

userSchema.methods.comparePassword = async function (password: string) {
	return await bcryptjs.compare(password, this.password as string);
};

userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString("hex");
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

export const User = mongoose.model("User", userSchema);
