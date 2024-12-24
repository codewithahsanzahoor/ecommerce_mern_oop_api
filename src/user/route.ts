import express from "express";
import {
	forgotPassword,
	loginUser,
	logoutUser,
	registerUser,
	resetPassword,
	updatePassword,
	userDetails,
} from "./controller";
import { isAuthenticated } from "../middleware/auth";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").post(isAuthenticated, userDetails);
router.route("/password/update").put(isAuthenticated, updatePassword);

export default router;
