import pool from "../db.js";

export const getAllOrganizations = async () => {
  const result = await pool.query(
    `SELECT
      organization_id,
      organization_name,
      organization_description,
      website,
      email
    FROM organizations
    ORDER BY organization_name ASC`,
  );

  return result.rows;
};
