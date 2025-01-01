import express from "express";
import {
	createOrUpdateReview,
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from "./controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
const router = express.Router();

router.route("/getall").get(getAllProducts);

router.route("/single/:id").get(getSingleProduct);

router.route("/createReview/:id").post(isAuthenticated, createOrUpdateReview);

//! admin routes
router
	.route("/admin/product/create")
	.post(isAuthenticated, authorizeRoles("admin"), createProduct);

router
	.route("/admin/product/:id")
	.put(isAuthenticated, authorizeRoles("admin"), updateProduct)
	.delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

export default router;
