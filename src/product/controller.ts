import { NextFunction, Request, Response } from "express";
import Product from "./model";
// import errorHandler from "../middleware/error";
import ErrorHandler from "../utils/errorHandler";
import errorHandler from "../middleware/error";

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await Product.find();
		res.status(200).json({ success: true, products });
	} catch (error) {
		// res.status(400).json({ message: "Get all products failed", error });
		const err = new ErrorHandler("Get all products failed", 400);
		next(errorHandler(err, req, res, next));
	}
	return next();
};

const getSingleProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		res.status(200).json({ success: true, product });
	} catch (error) {
		// res.status(400).json({ message: "Get single product failed" });
		const err = new ErrorHandler("Get all single product failed", 400);
		next(errorHandler(err, req, res, next));
	}
	return next();
};

const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, req.body);
		res.status(200).json({ success: true, product });
	} catch (error) {
		// res.status(400).json({ message: "Update product failed" });
		const err = new ErrorHandler("Update product failed", 400);
		next(errorHandler(err, req, res, next));
	}
	return next();
};

const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { body } = req;
	let createBook = {};
	try {
		createBook = await Product.create(body);
	} catch (error) {
		// res.status(400).json({ message: "Create product failed" });
		const err = new ErrorHandler("Create product failed", 400);
		next(errorHandler(err, req, res, next));
	}

	res.status(200).json({ success: true, createBook });
	return next();
};

const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			// res.status(404).json({ message: "Product not found" });
			const err = new ErrorHandler("Product not found", 404);
			next(errorHandler(err, req, res, next));
			return next();
		}
		res.status(200).json({ success: true, product });
	} catch (error) {
		// res.status(400).json({ message: "Delete product failed" });
		const err = new ErrorHandler("Delete product failed", 400);
		next(errorHandler(err, req, res, next));
	}
	return next();
};

export {
	getAllProducts,
	createProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
};
