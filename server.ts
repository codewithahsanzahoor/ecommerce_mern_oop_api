import app from "./src/app";
import { config } from "./src/config/config";

const startServer = async () => {
	try {
		app.listen(config.port, () => {
			console.log("Server is running on port 3000");
		});
	} catch (error) {
		console.log(error);
	}
};

startServer();
