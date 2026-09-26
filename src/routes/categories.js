import express from "express";
import {
    listCategories,
    showCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/categories", listCategories);
router.get("/category/:id", showCategory);

export default router;