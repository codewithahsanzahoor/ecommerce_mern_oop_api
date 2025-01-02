import express from "express";
import {
	createOrder,
	deleteOrder,
	getAllOrders,
	myOrders,
	orderDetails,
	updateOrderStatus,
} from "./orderController";
import { isAuthenticated } from "../middleware/auth";
import authorizeRoles from "../utils/authorizeRoles";
const router = express.Router();

router.route("/createOrder").post(isAuthenticated, createOrder);

router.route("/orderDetails/:id").get(isAuthenticated, orderDetails);

router.route("/me").get(isAuthenticated, myOrders);

// ! admin routes
router
	.route("/admin/orders")
	.get(isAuthenticated, authorizeRoles("admin"), getAllOrders);

router
	.route("/admin/order/:id")
	.put(isAuthenticated, authorizeRoles("admin"), updateOrderStatus)
	.delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

export default router;
