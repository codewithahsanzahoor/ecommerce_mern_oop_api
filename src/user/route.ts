import express from "express";
import {
	adminUserDetails,
	deleteUser,
	forgotPassword,
	getAllUsers,
	loginUser,
	logoutUser,
	registerUser,
	resetPassword,
	singleUserDetails,
	updatePassword,
	updateRole,
	updateUserProfile,
	userDetails,
} from "./controller";
import { isAuthenticated } from "../middleware/auth";
import authorizeRoles from "../utils/authorizeRoles";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

// these routes are for password reset procedure using email and mailer configuration
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").post(isAuthenticated, userDetails);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateUserProfile);

//! admin routes

router
	.route("/admin/user")
	.get(isAuthenticated, authorizeRoles("admin"), getAllUsers);

router
	.route("/admin/user/:id")
	.get(isAuthenticated, authorizeRoles("admin"), singleUserDetails)
	.delete(isAuthenticated, authorizeRoles("admin"), deleteUser)
	.put(isAuthenticated, authorizeRoles("admin"), updateRole);
router
	.route("/admin/me")
	.get(isAuthenticated, authorizeRoles("admin"), adminUserDetails);

export default router;
