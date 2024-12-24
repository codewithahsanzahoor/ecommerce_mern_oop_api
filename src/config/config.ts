import { config as conf } from "dotenv";
conf();

const _config = {
	port: process.env.PORT || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
	env: process.env.NODE_ENV || "development",
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRE || "1d",
	SMPT_SERVICE: process.env.SMPT_SERVICE,
	SMPT_EMAIL: process.env.SMPT_EMAIL,
	SMPT_PASSWORD: process.env.SMPT_PASSWORD,
	SMPT_HOST: process.env.SMPT_HOST,
	SMPT_PORT: process.env.SMPT_PORT,
};

export const config = Object.freeze(_config);
