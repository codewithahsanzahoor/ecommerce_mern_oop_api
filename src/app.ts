import morgan from "morgan";
import express from "express";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
	res.send("Hello World!");
});

export default app;
