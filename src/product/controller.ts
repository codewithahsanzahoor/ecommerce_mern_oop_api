import { NextFunction, Request, Response } from "express";
import Product from "./model";

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await Product.find();
		res.status(200).json({ message: "Get all products", products });
	} catch (error) {
		res.status(400).json({ message: "Get all products failed", error });
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
		res.status(200).json({ message: "Get single product", product });
	} catch (error) {
		res.status(400).json({ message: "Get single product failed" });
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
		res.status(200).json({ message: "Update product", product });
	} catch (error) {
		res.status(400).json({ message: "Update product failed" });
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
		res.status(400).json({ message: "Create product failed" });
	}

	res.status(200).json({ message: "Create product", createBook });
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
			res.status(404).json({ message: "Product not found" });
			return next();
		}
		res.status(200).json({ message: "Delete product", product });
	} catch (error) {
		res.status(400).json({ message: "Delete product failed" });
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
