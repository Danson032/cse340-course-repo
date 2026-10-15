import express from "express";
import { requireRole } from "../../w04/src/middleware/auth.js";

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
router.get("/new-category", requireRole("admin"), buildNewCategory);

router.post(
    "/new-category",
    requireRole("admin"),
    createCategoryController
);


// ================================
// EDIT CATEGORY
// ================================
router.get(
    "/edit-category/:id",
    requireRole("admin"),
    buildEditCategory
);

router.post(
    "/edit-category/:id",
    requireRole("admin"),
    updateCategoryController
);


// =====================================================
// ASSIGN CATEGORIES TO PROJECT
// =====================================================

// Show assignment page
router.get(
    "/project/:id/assign-category",
    requireRole("admin"),
    showAssignCategories
);

// Save category assignments
router.post(
    "/project/:id/assign-category",
    requireRole("admin"),
    updateProjectCategories
);


export default router;