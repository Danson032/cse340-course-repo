import pool from "../db.js";

export const getAllProjects = async () => {
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
    INNER JOIN organizations o ON o.organization_id = p.organization_id
    ORDER BY p.project_name ASC`,
  );

  return result.rows;
};
