import morgan from "morgan";
import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import ErrorHandler from "./middleware/error";
app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
import productRoute from "./product/route";
import userRoute from "./user/route";
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);

// global error handler
app.use(ErrorHandler);

export default app;
