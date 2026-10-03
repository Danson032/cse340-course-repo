import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  createCategory,
  updateCategory,
  updateProjectCategories,
} from "../models/categories.js";
import { getProjectById } from "../models/projects.js";

const validateCategoryName = (value) => {
  const categoryName = typeof value === "string" ? value.trim() : "";

  if (!categoryName) return "Category name is required.";
  if (categoryName.length < 3) return "Category name must be at least 3 characters.";
  if (categoryName.length > 100) return "Category name must not exceed 100 characters.";

  return null;
};

const isDuplicateError = (error) => error?.code === "23505";

export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render("categories", {
      pageTitle: "Categories",
      categories,
    });
  } catch (error) {
    console.error("Error loading categories:", error);
    res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const projects = await getProjectsByCategoryId(categoryId);

    res.render("category", {
      pageTitle: category.category_name,
      category,
      projects,
    });
  } catch (error) {
    console.error("Error loading category:", error);
    res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showNewCategory = (req, res) => {
  res.render("new-category", {
    pageTitle: "Create New Category",
    errors: [],
    category_name: "",
  });
};

export const createNewCategory = async (req, res) => {
  const categoryName =
    typeof req.body.category_name === "string"
      ? req.body.category_name.trim()
      : "";

  const errorMessage = validateCategoryName(categoryName);

  if (errorMessage) {
    return res.status(400).render("new-category", {
      pageTitle: "Create New Category",
      errors: [errorMessage],
      category_name: categoryName,
    });
  }

  try {
    await createCategory(categoryName);
    res.flash("Category created successfully.");
    return res.redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);

    if (isDuplicateError(error)) {
      return res.status(400).render("new-category", {
        pageTitle: "Create New Category",
        errors: ["A category with that name already exists."],
        category_name: categoryName,
      });
    }

    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showEditCategory = async (req, res) => {
  const categoryId = Number(req.params.id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  try {
    const category = await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    return res.render("edit-category", {
      pageTitle: `Edit ${category.category_name}`,
      category,
      errors: [],
    });
  } catch (error) {
    console.error("Error loading edit category page:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const editCategory = async (req, res) => {
  const categoryId = Number(req.params.id);
  const categoryName =
    typeof req.body.category_name === "string"
      ? req.body.category_name.trim()
      : "";

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const errorMessage = validateCategoryName(categoryName);

  if (errorMessage) {
    return res.status(400).render("edit-category", {
      pageTitle: "Edit Category",
      category: {
        category_id: categoryId,
        category_name: categoryName,
      },
      errors: [errorMessage],
    });
  }

  try {
    const updatedCategory = await updateCategory(categoryId, categoryName);

    if (!updatedCategory) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    res.flash("Category updated successfully.");
    return res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error("Error updating category:", error);

    if (isDuplicateError(error)) {
      return res.status(400).render("edit-category", {
        pageTitle: "Edit Category",
        category: {
          category_id: categoryId,
          category_name: categoryName,
        },
        errors: ["A category with that name already exists."],
      });
    }

    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};


const getCategoryIds = (value) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(values.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
};

export const showAssignCategories = async (req, res) => {
  const projectId = Number(req.params.id);
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  try {
    const project = await getProjectById(projectId);
    if (!project) return res.status(404).render("404", { pageTitle: "Not Found" });

    const [categories, selected] = await Promise.all([
      getAllCategories(),
      getCategoriesByProjectId(projectId),
    ]);

    return res.render("assign-categories", {
      pageTitle: `Assign Categories - ${project.project_name}`,
      project,
      categories,
      selectedCategoryIds: selected.map((category) => category.category_id),
      errors: [],
    });
  } catch (error) {
    console.error("Error loading category assignment page:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const assignCategories = async (req, res) => {
  const projectId = Number(req.params.id);
  const categoryIds = getCategoryIds(req.body.category_ids);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  try {
    const project = await getProjectById(projectId);
    if (!project) return res.status(404).render("404", { pageTitle: "Not Found" });

    const categories = await getAllCategories();
    const validIds = new Set(categories.map((category) => category.category_id));
    const invalid = categoryIds.some((id) => !validIds.has(id));

    if (invalid) {
      return res.status(400).render("assign-categories", {
        pageTitle: `Assign Categories - ${project.project_name}`,
        project,
        categories,
        selectedCategoryIds: categoryIds,
        errors: ["Select only valid categories."],
      });
    }

    await updateProjectCategories(projectId, categoryIds);
    res.flash("Project categories updated successfully.");
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error assigning categories:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};
