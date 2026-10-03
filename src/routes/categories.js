import express from "express";

import {
    listCategories,
    showCategory,
    buildNewCategory,
    createCategoryController,
    buildEditCategory,
    updateCategoryController,
    showAssignCategories,
    updateProjectCategories,
} from "../controllers/categoriesController.js";

const router = express.Router();


// ================================
// CATEGORY LIST
// ================================
router.get("/categories", listCategories);


// ================================
// SINGLE CATEGORY
// ================================
router.get("/category/:id", showCategory);


// ================================
// CREATE CATEGORY
// ================================
router.get("/new-category", buildNewCategory);

router.post(
    "/new-category",
    createCategoryController
);


// ================================
// EDIT CATEGORY
// ================================
router.get(
    "/edit-category/:id",
    buildEditCategory
);

router.post(
    "/edit-category/:id",
    updateCategoryController
);


// =====================================================
// ASSIGN CATEGORIES TO PROJECT
// =====================================================

// Show assignment page
router.get(
    "/project/:id/assign-category",
    showAssignCategories
);

// Save category assignments
router.post(
    "/project/:id/assign-category",
    updateProjectCategories
);


export default router;