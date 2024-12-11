import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () => {
			console.log(`MongoDB Connected`);
		});

		mongoose.connection.on("error", (err) => {
			console.log(`MongoDB Connection Error: ${err}`);
		});
		await mongoose.connect(
			config.MONGODB_URI || "mongodb://localhost:27017/ecommercemern"
		);
	} catch (error) {
		console.error(`Failed to connect to MongoDB: ${error}`);
		process.exit(1);
	}
};

export default connectDB;
