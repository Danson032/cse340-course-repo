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
    INNER JOIN organizations o
      ON o.organization_id = p.organization_id
    WHERE p.project_date >= CURRENT_DATE
    ORDER BY p.project_date ASC
    LIMIT 5`,
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
    INNER JOIN organizations o
      ON o.organization_id = p.organization_id
    WHERE p.project_id = $1`,
    [projectId],
  );

  return result.rows[0];
};

// Add a user to a project's volunteer list. The composite primary key makes
// repeated sign-ups safe and prevents duplicate volunteer records.
export const addVolunteer = async (projectId, userId) => {
  const result = await pool.query(
    `INSERT INTO project_volunteers (project_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (project_id, user_id) DO NOTHING
     RETURNING project_id, user_id`,
    [projectId, userId],
  );
  return result.rowCount > 0;
};

export const removeVolunteer = async (projectId, userId) => {
  const result = await pool.query(
    `DELETE FROM project_volunteers
     WHERE project_id = $1 AND user_id = $2`,
    [projectId, userId],
  );
  return result.rowCount > 0;
};

export const isUserVolunteering = async (projectId, userId) => {
  const result = await pool.query(
    `SELECT EXISTS (
       SELECT 1 FROM project_volunteers
       WHERE project_id = $1 AND user_id = $2
     ) AS is_volunteering`,
    [projectId, userId],
  );
  return result.rows[0].is_volunteering;
};

export const getVolunteeredProjectsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT
       p.project_id,
       p.project_name,
       p.project_description,
       p.project_date,
       p.location,
       p.organization_id,
       o.organization_name,
       pv.created_at AS volunteered_at
     FROM project_volunteers pv
     INNER JOIN projects p ON p.project_id = pv.project_id
     INNER JOIN organizations o ON o.organization_id = p.organization_id
     WHERE pv.user_id = $1
     ORDER BY p.project_date ASC NULLS LAST, p.project_name ASC`,
    [userId],
  );
  return result.rows;
};
