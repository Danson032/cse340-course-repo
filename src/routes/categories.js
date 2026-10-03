import express from "express";
import {
    listCategories,
    showCategory,
    buildNewCategory,
    createCategoryController,
    buildEditCategory,
    updateCategoryController,
} from "../controllers/categoriesController.js";

const router = express.Router();

router.get("/categories", listCategories);
router.get("/category/:id", showCategory);

// Create Category
router.get("/new-category", buildNewCategory);
router.post("/new-category", createCategoryController);

// Edit Category
router.get("/edit-category/:id", buildEditCategory);
router.post("/edit-category/:id", updateCategoryController);

export default router;