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
    ORDER BY p.project_date ASC`,
  );

  return result.rows;
};

export const getProjectById = async (projectId) => {
  const result = await pool.query(
    `SELECT
      p.project_id,
      p.project_name,
      p.project_description,
      p.project_date,
      p.location,
      p.organization_id,
      o.organization_name,
      o.organization_description,
      o.website,
      o.email
    FROM projects p
    INNER JOIN organizations o ON o.organization_id = p.organization_id
    WHERE p.project_id = $1`,
    [projectId],
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
