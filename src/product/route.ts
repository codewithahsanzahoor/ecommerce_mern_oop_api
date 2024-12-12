import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
} from "./controller";
const router = express.Router();

router.route("/create").post(createProduct);
router.route("/getall").get(getAllProducts);
router.route("/single/:id").get(getSingleProduct);
router.route("/update/:id").put(updateProduct);
router.route("/delete/:id").delete(deleteProduct);

export default router;
