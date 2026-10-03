import pool from "../db.js";

export const getAllCategories = async () => {
  const result = await pool.query(
    `SELECT
      category_id,
      category_name
    FROM categories
    ORDER BY category_name ASC`,
  );

  return result.rows;
};

export const getCategoryById = async (categoryId) => {
  const result = await pool.query(
    `SELECT
      category_id,
      category_name
    FROM categories
    WHERE category_id = $1`,
    [categoryId],
  );

  return result.rows[0];
};

export const getCategoriesByProjectId = async (projectId) => {
  const result = await pool.query(
    `SELECT
      c.category_id,
      c.category_name
    FROM categories c
    INNER JOIN project_categories pc
      ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_name ASC`,
    [projectId],
  );

  return result.rows;
};

export const getProjectsByCategoryId = async (categoryId) => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.project_description,
      p.project_date,
      p.location,
      p.organization_id,
      o.organization_name
    FROM projects p
    INNER JOIN project_categories pc
      ON pc.project_id = p.project_id
    INNER JOIN organizations o
      ON o.organization_id = p.organization_id
    WHERE pc.category_id = $1
    ORDER BY p.project_date ASC`,
    [categoryId],
  );

  return result.rows;
};

// Create a new category
export const createCategory = async (categoryName) => {
  const result = await pool.query(
    `INSERT INTO categories (category_name)
     VALUES ($1)
     RETURNING category_id, category_name`,
    [categoryName],
  );

  return result.rows[0];
};

// Update an existing category
export const updateCategory = async (categoryId, categoryName) => {
  const result = await pool.query(
    `UPDATE categories
     SET category_name = $1
     WHERE category_id = $2
     RETURNING category_id, category_name`,
    [categoryName, categoryId],
  );

  return result.rows[0];
};