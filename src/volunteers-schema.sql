-- Safe migration for an existing database. Does not drop project or user data.
CREATE TABLE IF NOT EXISTS project_volunteers (
  project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS project_volunteers_user_id_idx
  ON project_volunteers(user_id);
