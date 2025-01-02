import { NextFunction, Request, Response } from "express";
import Product from "../product/model";
import ErrorHandler from "../utils/errorHandler";
import errorHandler from "../middleware/error";
import OrderModel from "./orderModel";
import { Types } from "mongoose";

export interface CustomRequest extends Request {
	user: {
		_id: string;
		name: string;
		email: string;
		role: string;
	};
}

// create order
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = (req as CustomRequest).user;
		const {
			shippingInfo,
			orderItems,
			paymentInfo,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		} = req.body;
		const order = await OrderModel.create({
			shippingInfo,
			orderItems,
			paymentInfo,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
			paidAt: Date.now(),
			user: user._id,
		});
		res.status(200).json({
			success: true,
			message: "Order created",
			order,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// order details
const orderDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const order = await OrderModel.findById(id).populate(
			"user",
			"name email"
		);
		if (!order) {
			const Error = new ErrorHandler("Order not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		res.status(200).json({
			success: true,
			message: "Order details",
			order,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// logged in user orders
const myOrders = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = (req as CustomRequest).user;
		const orders = await OrderModel.find({ user: user._id });
		res.status(200).json({
			success: true,
			message: "My orders",
			orders,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// ! admin routes controllers

// get all orders
const getAllOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orders = await OrderModel.find();
		res.status(200).json({ success: true, message: "Orders", orders });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// update order status

const updateOrderStatus = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	async function updateStock(id: number | Types.ObjectId, quantity: number) {
		const product = await Product.findById(id);
		if (product) {
			product.stock -= quantity;
			await product.save({ validateBeforeSave: false });
		} else {
			throw new Error(`Product not found with id ${id}`);
		}
	}

	try {
		const { id } = req.params;
		const order = await OrderModel.findById(id);
		if (!order) {
			const Error = new ErrorHandler("Order not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		if (order.orderStatus === "Delivered") {
			const Error = new ErrorHandler(
				"You have already delivered this order",
				400
			);
			return next(errorHandler(Error, req, res, next));
		}

		order.orderItems.forEach(async (item) => {
			await updateStock(item.product as Types.ObjectId, item.quantity);
		});

		order.orderStatus = req.body.status;

		if (order.orderStatus === "Delivered") {
			order.deliveredAt = new Date(Date.now());
		}

		await order.save();

		res.status(200).json({
			success: true,
			message: "Order status updated",
			order,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// delete order
const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const order = await OrderModel.findByIdAndDelete(id);
		if (!order) {
			const Error = new ErrorHandler("Order not found", 404);
			return next(errorHandler(Error, req, res, next));
		}
		res.status(200).json({
			success: true,
			message: "Order deleted",
			order,
		});
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

export {
	createOrder,
	orderDetails,
	myOrders,
	getAllOrders,
	updateOrderStatus,
	deleteOrder,
};
