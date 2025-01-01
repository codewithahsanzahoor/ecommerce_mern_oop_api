import { NextFunction, Request, Response } from "express";
import Product from "./model";
import ErrorHandler from "../utils/errorHandler";
import errorHandler from "../middleware/error";
import ApiFeatures from "../utils/apiFeatures";

interface CustomRequest extends Request {
	user: any;
}

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const limit = 2;
		const productCount = await Product.countDocuments();
		const apiFeatures = new ApiFeatures(Product.find(), req.query)
			.search()
			.filter()
			.pagination(limit);
		const products = await apiFeatures.query;
		res.status(200).json({ success: true, products, productCount });
	} catch (error: any) {
		// res.status(400).json({ message: "Get all products failed", error });
		// const err = new ErrorHandler("Get all products failed", 400);

		return next(errorHandler(error, req, res, next));
	}
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
	} catch (error: any) {
		// res.status(400).json({ message: "Get single product failed" });
		// const err = new ErrorHandler("Get all single product failed", 400);

		next(errorHandler(error, req, res, next));
	}
};

// create or update review of product
const createOrUpdateReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			const err = new ErrorHandler("Product not found", 404);
			return next(errorHandler(err, req, res, next));
		}
		const review = {
			user: (req as CustomRequest).user._id,
			name: (req as CustomRequest).user.name,
			rating: Number(req.body.rating),
			comment: req.body.comment,
		};
		const isReviewed = product?.reviews.find(
			(r) =>
				r.user.toString() === (req as CustomRequest).user._id.toString()
		);
		if (isReviewed) {
			product.reviews.forEach((review) => {
				if (
					review.user.toString() ===
					(req as CustomRequest).user._id.toString()
				) {
					review.rating = req.body.rating;
					review.comment = req.body.comment;
				}
			});
		} else {
			product.reviews.push(review);
			product.noOfReviews = product.reviews.length;
		}
		product.ratings =
			(product?.reviews ?? []).reduce(
				(acc, item) => item.rating + acc,
				0
			) / (product?.reviews?.length ?? 1);
		await product.save({ validateBeforeSave: false });
		res.status(200).json({ success: true, message: "Review added" });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// get all reviews of a product
const getAllReviews = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id).select("reviews");
		if (!product) {
			const err = new ErrorHandler("Product not found", 404);
			return next(errorHandler(err, req, res, next));
		}
		res.status(200).json({ success: true, product });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// delete review of a product
const deleteReview = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			const err = new ErrorHandler("Product not found", 404);
			return next(errorHandler(err, req, res, next));
		}
		const reviews = product?.reviews.filter(
			(r) =>
				r.user.toString() !== (req as CustomRequest).user._id.toString()
		);
		product.reviews = reviews;
		product.noOfReviews = product.reviews.length;
		product.ratings =
			(product?.reviews ?? []).reduce(
				(acc, curr) => acc + curr.rating,
				0
			) / (product?.reviews?.length ?? 1);
		await product.save({ validateBeforeSave: false });
		res.status(200).json({ success: true, message: "Review deleted" });
	} catch (error: any) {
		return next(errorHandler(error, req, res, next));
	}
};

// ! admin routes for products

const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, req.body);
		res.status(200).json({ success: true, product });
	} catch (error: any) {
		// res.status(400).json({ message: "Update product failed" });
		// const err = new ErrorHandler("Update product failed", 400);

		next(errorHandler(error, req, res, next));
	}
};

const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { body } = req;
	let createBook = {};
	try {
		const user = (req as CustomRequest).user;
		// console.log(user);
		createBook = await Product.create({ ...body, user: user._id });
		res.status(200).json({ success: true, createBook });
	} catch (error: any) {
		// res.status(400).json({ message: "Create product failed" });
		// const err = new ErrorHandler("Create product failed", 400);

		next(errorHandler(error, req, res, next));
	}
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
	} catch (error: any) {
		// res.status(400).json({ message: "Delete product failed" });
		// const err = new ErrorHandler("Delete product failed", 400);

		next(errorHandler(error, req, res, next));
	}
};

export {
	getAllProducts,
	createProduct,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	createOrUpdateReview,
	getAllReviews,
	deleteReview,
};
