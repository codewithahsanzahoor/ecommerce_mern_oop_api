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
app.use("/api/v1/product", productRoute);
import userRoute from "./user/route";
app.use("/api/v1/user", userRoute);
import orderRoute from "./order/orderRoute";
app.use("/api/v1/order", orderRoute);

// global error handler
app.use(ErrorHandler);

export default app;
