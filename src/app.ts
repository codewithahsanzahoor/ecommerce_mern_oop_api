import morgan from "morgan";
import express from "express";
const app = express();
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
import productRoute from "./product/route";
app.use("/api/v1/products", productRoute);

// global error handler

export default app;
