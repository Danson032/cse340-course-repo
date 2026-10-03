import pool from "../db.js";

export const getAllOrganizations = async () => {
  const result = await pool.query(
    `SELECT organization_id, organization_name, organization_description, website, email
     FROM organizations
     ORDER BY organization_name ASC`,
  );
  return result.rows;
};

export const getOrganizationById = async (organizationId) => {
  const result = await pool.query(
    `SELECT organization_id, organization_name, organization_description, website, email
     FROM organizations
     WHERE organization_id = $1`,
    [organizationId],
  );
  return result.rows[0];
};

export const createOrganization = async (organization) => {
  const result = await pool.query(
    `INSERT INTO organizations
      (organization_name, organization_description, website, email)
     VALUES ($1, $2, $3, $4)
     RETURNING organization_id, organization_name, organization_description, website, email`,
    [
      organization.organization_name,
      organization.organization_description,
      organization.website,
      organization.email,
    ],
  );
  return result.rows[0];
};

export const updateOrganization = async (organizationId, organization) => {
  const result = await pool.query(
    `UPDATE organizations
     SET organization_name = $1,
         organization_description = $2,
         website = $3,
         email = $4
     WHERE organization_id = $5
     RETURNING organization_id, organization_name, organization_description, website, email`,
    [
      organization.organization_name,
      organization.organization_description,
      organization.website,
      organization.email,
      organizationId,
    ],
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
