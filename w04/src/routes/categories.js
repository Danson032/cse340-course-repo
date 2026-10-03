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

const router = express.Router();

router.get("/categories", listCategories);
router.get("/category/:id", showCategory);

router.get("/new-category", showNewCategory);
router.post("/new-category", createNewCategory);

router.get("/edit-category/:id", showEditCategory);
router.post("/edit-category/:id", editCategory);

router.get("/assign-categories/:id", showAssignCategories);
router.post("/assign-categories/:id", assignCategories);

export default router;
