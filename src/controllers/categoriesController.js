import { getAllCategories, getCategoryById, getProjectsByCategoryId } from "../models/categories.js";

export const listCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render("categories", { pageTitle: "Categories", categories });
    } catch (error) {
        console.error("Error loading categories:", error);
        res.status(500).render("500", { pageTitle: "Server Error" });
    }
};

export const showCategory = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render("404", { pageTitle: "Not Found" });
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render("category", { pageTitle: `Category: ${category.category_name}`, category, projects });
    } catch (error) {
        console.error("Error loading category:", error);
        res.status(500).render("500", { pageTitle: "Server Error" });
    }
};
