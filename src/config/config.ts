import { config as conf } from "dotenv";
conf();

const _config = {
	port: process.env.PORT || 3000,
	MONGODB_URI: process.env.MONGODB_URI,
};

export const config = Object.freeze(_config);
