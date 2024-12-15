import app from "./src/app";
import { config } from "./src/config/config";
import connectDB from "./src/config/db";
import http from "http";

let server: http.Server;

const startServer = async () => {
	try {
		await connectDB();

		server = app.listen(config.port, () => {
			console.log("Server is running on port " + config.port);
		});
	} catch (error) {
		console.log(error);
	}
};

startServer();

// for handling unhandled promise rejections (like catch block)
// process.on("unhandledRejection", (error: Error) => {
// 	if (server) {
// 		server.close(() => {
// 			console.log("Error: ", error.message);
// 			console.log(
// 				"shutting down server due to unhandled promise rejection"
// 			);
// 			process.exit(1);
// 		});
// 	} else {
// 		process.exit(1);
// 	}
// });
