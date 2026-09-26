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

export const getOrganizationById = async (organizationId) => {
  const result = await pool.query(
    `SELECT
      organization_id,
      organization_name,
      organization_description,
      website,
      email
    FROM organizations
    WHERE organization_id = $1`,
    [organizationId],
  );

  return result.rows[0];
};

export const getProjectsByOrganizationId = async (organizationId) => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.project_description,
      p.project_date,
      p.location,
      p.organization_id
    FROM projects p
    WHERE p.organization_id = $1
    ORDER BY p.project_date ASC`,
    [organizationId],
  );

  return result.rows;
};
