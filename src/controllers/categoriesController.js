import {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
  updateProjectCategories,
} from "../models/categories.js";

import { getProjectById } from "../models/projects.js";


// ================================
// LIST CATEGORIES
// ================================
export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      pageTitle: "Categories",
      categories,
    });
  } catch (error) {
    console.error("Error loading categories:", error);

    res.status(500).render("500", {
      pageTitle: "Server Error",
    });
  }
};


// ================================
// SHOW CATEGORY
// ================================
export const showCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render("category", {
      pageTitle: category.category_name,
      category,
      projects,
    });
  } catch (error) {
    console.error("Error loading category:", error);

    res.status(500).render("500", {
      pageTitle: "Server Error",
    });
  }
};


// ================================
// CREATE CATEGORY PAGE
// ================================
export const buildNewCategory = async (req, res) => {
  res.render("new-category", {
    pageTitle: "Create New Category",
    errors: [],
    category_name: "",
  });
};


// ================================
// CREATE CATEGORY
// ================================
export const createCategoryController = async (req, res) => {
  const category_name = req.body.category_name?.trim() || "";
  const errors = [];

  if (!category_name) {
    errors.push("Category name is required.");
  } else if (category_name.length < 3) {
    errors.push("Category name must be at least 3 characters.");
  }

  if (category_name.length > 100) {
    errors.push("Category name must not exceed 100 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).render("new-category", {
      pageTitle: "Create New Category",
      errors,
      category_name,
    });
  }

  try {
    await createCategory(category_name);

    req.flash("notice", "Category created successfully.");

    return res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);

    return res.status(500).render("new-category", {
      pageTitle: "Create New Category",
      errors: ["An error occurred while creating the category."],
      category_name,
    });
  }
};


// ================================
// EDIT CATEGORY PAGE
// ================================
export const buildEditCategory = async (req, res) => {
  const categoryId = Number(req.params.id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(404).render("404", {
      pageTitle: "Not Found",
    });
  }

  try {
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    res.render("edit-category", {
      pageTitle: "Edit Category",
      errors: [],
      category,
    });
  } catch (error) {
    console.error("Error loading edit category:", error);

    res.status(500).render("500", {
      pageTitle: "Server Error",
    });
  }
};


// ================================
// UPDATE CATEGORY
// ================================
export const updateCategoryController = async (req, res) => {
  const categoryId = Number(req.params.id);
  const category_name = req.body.category_name?.trim() || "";
  const errors = [];

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(404).render("404", {
      pageTitle: "Not Found",
    });
  }

  if (!category_name) {
    errors.push("Category name is required.");
  } else if (category_name.length < 3) {
    errors.push("Category name must be at least 3 characters.");
  }

  if (category_name.length > 100) {
    errors.push("Category name must not exceed 100 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).render("edit-category", {
      pageTitle: "Edit Category",
      errors,
      category: {
        category_id: categoryId,
        category_name,
      },
    });
  }

  try {
    const updatedCategory = await updateCategory(
      categoryId,
      category_name
    );

    if (!updatedCategory) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    req.flash("notice", "Category updated successfully.");

    return res.redirect("/categories");
  } catch (error) {
    console.error("Error updating category:", error);

    return res.status(500).render("edit-category", {
      pageTitle: "Edit Category",
      errors: ["An error occurred while updating the category."],
      category: {
        category_id: categoryId,
        category_name,
      },
    });
  }
};


// =====================================================
// SHOW ASSIGN CATEGORIES PAGE
// =====================================================
export const showAssignCategories = async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    const categories = await getCategoriesForAssignment(projectId);

    // This confirms the current project-category assignments.
    const currentCategories = await getCategoriesByProjectId(projectId);

    const currentCategoryIds = currentCategories.map(
      (category) => Number(category.category_id)
    );

    const assignmentCategories = categories.map((category) => ({
      ...category,
      assigned: currentCategoryIds.includes(
        Number(category.category_id)
      ),
    }));

    res.render("assign-category", {
      pageTitle: `Assign Categories - ${project.project_name}`,
      project,
      categories: assignmentCategories,
      errors: [],
    });
  } catch (error) {
    console.error(
      "Error loading category assignment page:",
      error
    );

    res.status(500).render("500", {
      pageTitle: "Server Error",
    });
  }
};


// =====================================================
// UPDATE PROJECT CATEGORIES
// =====================================================
export const updateProjectCategories = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(404).render("404", {
      pageTitle: "Not Found",
    });
  }

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", {
        pageTitle: "Not Found",
      });
    }

    let categoryIds = req.body.category_ids || [];

    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds];
    }

    categoryIds = categoryIds
      .map((id) => Number(id))
      .filter(
        (id) => Number.isInteger(id) && id > 0
      );

    await assignCategoriesToProject(
      projectId,
      categoryIds
    );

    req.flash(
      "notice",
      "Project categories updated successfully."
    );

    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error(
      "Error updating project categories:",
      error
    );

    try {
      const project = await getProjectById(projectId);
      const categories =
        await getCategoriesForAssignment(projectId);

      return res.status(500).render("assign-category", {
        pageTitle: "Assign Categories",
        project,
        categories,
        errors: [
          "An error occurred while updating the project categories.",
        ],
      });
    } catch (renderError) {
      console.error(
        "Error rendering category assignment page:",
        renderError
      );

      return res.status(500).render("500", {
        pageTitle: "Server Error",
      });
    }
  }
};