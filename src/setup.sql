DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  organization_description TEXT,
  website VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  project_date DATE,
  organization_id INTEGER NOT NULL,
  CONSTRAINT fk_projects_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
  project_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  PRIMARY KEY (project_id, category_id),
  CONSTRAINT fk_project_categories_project
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_project_categories_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

INSERT INTO organizations (organization_name, organization_description, website, email) VALUES
  ('BrightFuture Builders', 'Creates safe, welcoming spaces for families and neighborhoods.', 'https://brightfuture.org', 'info@brightfuture.org'),
  ('GreenHarvest Growers', 'Grows fresh food and sustainable habits for local communities.', 'https://greenharvest.org', 'contact@greenharvest.org'),
  ('UnityServe Volunteers', 'Brings neighbors together through hands-on service projects.', 'https://unityserve.org', 'hello@unityserve.org');

INSERT INTO projects (project_name, project_description, project_date, organization_id) VALUES
  ('Park Cleanup', 'Restore local parks and create cleaner places for everyone to enjoy.', '2026-10-05', 1),
  ('Food Drive', 'Collect and distribute essential food supplies to neighbors in need.', '2026-10-12', 2),
  ('Community Tutoring', 'Help students build confidence through one-on-one academic support.', '2026-10-18', 3);

INSERT INTO categories (category_name) VALUES
  ('Environment'),
  ('Community Service'),
  ('Education'),
  ('Food and Basic Needs');

INSERT INTO project_categories (project_id, category_id) VALUES
  (1, 1),
  (1, 2),
  (2, 2),
  (2, 4),
  (3, 2),
  (3, 3);
