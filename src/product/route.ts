import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from "./controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
const router = express.Router();

router
	.route("/create")
	.post(isAuthenticated, authorizeRoles("admin"), createProduct);

router.route("/getall").get(getAllProducts);

router.route("/single/:id").get(getSingleProduct);

router
	.route("/update/:id")
	.put(isAuthenticated, authorizeRoles("admin"), updateProduct);

router
	.route("/delete/:id")
	.delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);

export default router;
