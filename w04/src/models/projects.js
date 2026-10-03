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
    INNER JOIN organizations o ON o.organization_id = p.organization_id
    WHERE p.project_id = $1`,
    [projectId],
  );
  return result.rows[0];
};

export const createProject = async (project, categoryIds) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `INSERT INTO projects
        (project_name, project_description, project_date, location, organization_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING project_id`,
      [
        project.project_name,
        project.project_description,
        project.project_date || null,
        project.location,
        project.organization_id,
      ],
    );

    const projectId = projectResult.rows[0].project_id;

    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO project_categories (project_id, category_id)
         VALUES ($1, $2)`,
        [projectId, categoryId],
      );
    }

    await client.query("COMMIT");
    return projectId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateProject = async (projectId, project, categoryIds) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query(
      `UPDATE projects
       SET project_name = $1,
           project_description = $2,
           project_date = $3,
           location = $4,
           organization_id = $5
       WHERE project_id = $6
       RETURNING project_id`,
      [
        project.project_name,
        project.project_description,
        project.project_date || null,
        project.location,
        project.organization_id,
        projectId,
      ],
    );

    if (!projectResult.rows[0]) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `DELETE FROM project_categories
       WHERE project_id = $1`,
      [projectId],
    );

    for (const categoryId of categoryIds) {
      await client.query(
        `INSERT INTO project_categories (project_id, category_id)
         VALUES ($1, $2)`,
        [projectId, categoryId],
      );
    }

    await client.query("COMMIT");
    return projectResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
