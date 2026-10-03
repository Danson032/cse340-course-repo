import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
} from "../models/categories.js";

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

// Display create category page
export const buildNewCategory = async (req, res) => {
  res.render("new-category", {
    pageTitle: "Create New Category",
    errors: [],
    category_name: "",
  });
};

// Process create category
export const createCategoryController = async (req, res) => {
  const category_name = req.body.category_name?.trim() || "";
  const errors = [];

  if (!category_name) {
    errors.push("Category name is required.");
  }

  if (category_name.length < 3) {
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

    req.flash("notice", "Unable to create category.");
    return res.status(500).render("new-category", {
      pageTitle: "Create New Category",
      errors: ["An error occurred while creating the category."],
      category_name,
    });
  }
};

// Display edit category page
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

// Process edit category
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
  }

  if (category_name.length < 3) {
    errors.push("Category name must be at least 3 characters.");
  }

  if (category_name.length > 100) {
    errors.push("Category name must not exceed 100 characters.");
  }

  if (errors.length > 0) {
    const category = {
      category_id: categoryId,
      category_name,
    };

    return res.status(400).render("edit-category", {
      pageTitle: "Edit Category",
      errors,
      category,
    });
  }

  try {
    const updatedCategory = await updateCategory(
      categoryId,
      category_name,
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

    req.flash("notice", "Unable to update category.");

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