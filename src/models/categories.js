import pool from "../db.js";

export const getAllCategories = async () => {
  const result = await pool.query(
    "SELECT category_id, category_name FROM categories ORDER BY category_name ASC",
  );

  return result.rows;
};
