
import express from "express";

import {
  listCategories,
  showCategory,
  showNewCategory,
  createNewCategory,
  showEditCategory,
  editCategory,
  showAssignCategories,
  assignCategories,
} from "../controllers/categoriesController.js";

import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/categories", listCategories);
router.get("/category/:id", showCategory);

// Admin-only category creation
router.get("/new-category", requireRole("admin"), showNewCategory);
router.post("/new-category", requireRole("admin"), createNewCategory);

// Admin-only category editing
router.get("/edit-category/:id", requireRole("admin"), showEditCategory);
router.post("/edit-category/:id", requireRole("admin"), editCategory);

// Admin-only category assignment
router.get("/assign-categories/:id", requireRole("admin"), showAssignCategories);
router.post("/assign-categories/:id", requireRole("admin"), assignCategories);

export default router;
