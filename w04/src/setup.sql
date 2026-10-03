-- ============================================
-- CSE 340 SERVICE NETWORK DATABASE
-- W02 Database Retrieval
-- ============================================

-- Drop existing tables in the correct order
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;


-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL,
  organization_description TEXT,
  website VARCHAR(255),
  email VARCHAR(255)
);


-- ============================================
-- PROJECTS TABLE
-- ============================================

CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  project_date DATE,
  location VARCHAR(255) NOT NULL,
  organization_id INTEGER NOT NULL,

  CONSTRAINT fk_projects_organization
    FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);


-- ============================================
-- CATEGORIES TABLE
-- ============================================

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================
-- PROJECT CATEGORIES JUNCTION TABLE
-- ============================================

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


-- ============================================
-- ORGANIZATION DATA
-- ============================================

INSERT INTO organizations (
  organization_name,
  organization_description,
  website,
  email
) VALUES
(
  'BrightFuture Builders',
  'Creates safe, welcoming spaces for families and neighborhoods.',
  'https://brightfuture.org',
  'info@brightfuture.org'
),
(
  'GreenHarvest Growers',
  'Grows fresh food and sustainable habits for local communities.',
  'https://greenharvest.org',
  'contact@greenharvest.org'
),
(
  'UnityServe Volunteers',
  'Brings neighbors together through hands-on service projects.',
  'https://unityserve.org',
  'hello@unityserve.org'
);


-- ============================================
-- PROJECT DATA
-- 5 PROJECTS FOR EACH ORGANIZATION
-- ============================================

INSERT INTO projects (
  project_name,
  project_description,
  project_date,
  location,
  organization_id
) VALUES

-- ============================================
-- BRIGHTFUTURE BUILDERS - ORGANIZATION 1
-- ============================================

(
  'Park Cleanup',
  'Restore local parks and create cleaner places for everyone to enjoy.',
  '2026-10-05',
  'Nairobi Central Park',
  1
),

(
  'Community Center Renovation',
  'Help repair and improve a community center used by local families.',
  '2026-10-10',
  'Eastlands Community Center',
  1
),

(
  'School Classroom Improvement',
  'Help improve classrooms and create better learning spaces for students.',
  '2026-10-17',
  'Nairobi Primary School',
  1
),

(
  'Neighborhood Cleanup',
  'Work with residents to clean streets and improve the local neighborhood.',
  '2026-10-24',
  'Kasarani',
  1
),

(
  'Youth Recreation Project',
  'Help create a safe recreational space where young people can gather and play.',
  '2026-10-31',
  'Embakasi Youth Center',
  1
),


-- ============================================
-- GREENHARVEST GROWERS - ORGANIZATION 2
-- ============================================

(
  'Community Garden',
  'Create and maintain a community garden that provides fresh produce.',
  '2026-10-06',
  'Kibera Community Garden',
  2
),

(
  'Tree Planting Day',
  'Plant trees and teach community members about environmental conservation.',
  '2026-10-13',
  'Karura Forest',
  2
),

(
  'Food Drive',
  'Collect and distribute essential food supplies to neighbors in need.',
  '2026-10-20',
  'Mathare Community Hall',
  2
),

(
  'Urban Farming Workshop',
  'Teach families practical methods for growing food in small urban spaces.',
  '2026-10-27',
  'Ngara Community Center',
  2
),

(
  'Recycling Awareness Project',
  'Educate residents about recycling and responsible waste management.',
  '2026-11-03',
  'Westlands Community Center',
  2
),


-- ============================================
-- UNITYSERVE VOLUNTEERS - ORGANIZATION 3
-- ============================================

(
  'Community Tutoring',
  'Help students build confidence through one-on-one academic support.',
  '2026-10-07',
  'Kawangware Learning Center',
  3
),

(
  'School Supplies Drive',
  'Collect school supplies and distribute them to students who need assistance.',
  '2026-10-14',
  'Dagoretti Primary School',
  3
),

(
  'Youth Mentorship Program',
  'Connect young people with volunteers who can provide guidance and encouragement.',
  '2026-10-21',
  'Kilimani Youth Center',
  3
),

(
  'Community Health Awareness',
  'Provide information about healthy living and basic preventive healthcare.',
  '2026-10-28',
  'Roysambu Community Hall',
  3
),

(
  'Family Support Day',
  'Bring volunteers together to provide practical support to families in need.',
  '2026-11-04',
  'Umoja Community Center',
  3
);


-- ============================================
-- CATEGORY DATA
-- ============================================

INSERT INTO categories (category_name) VALUES
  ('Environment'),
  ('Community Service'),
  ('Education'),
  ('Food and Basic Needs');


-- ============================================
-- PROJECT / CATEGORY RELATIONSHIPS
-- Every project has at least one category.
-- Some projects have multiple categories.
-- ============================================

INSERT INTO project_categories (project_id, category_id) VALUES

-- Project 1 - Park Cleanup
(1, 1),
(1, 2),

-- Project 2 - Community Center Renovation
(2, 2),

-- Project 3 - School Classroom Improvement
(3, 3),
(3, 2),

-- Project 4 - Neighborhood Cleanup
(4, 1),
(4, 2),

-- Project 5 - Youth Recreation Project
(5, 2),
(5, 3),

-- Project 6 - Community Garden
(6, 1),
(6, 2),

-- Project 7 - Tree Planting Day
(7, 1),

-- Project 8 - Food Drive
(8, 4),
(8, 2),

-- Project 9 - Urban Farming Workshop
(9, 1),
(9, 3),

-- Project 10 - Recycling Awareness Project
(10, 1),
(10, 3),

-- Project 11 - Community Tutoring
(11, 3),
(11, 2),

-- Project 12 - School Supplies Drive
(12, 3),
(12, 4),

-- Project 13 - Youth Mentorship Program
(13, 3),
(13, 2),

-- Project 14 - Community Health Awareness
(14, 2),
(14, 4),

-- Project 15 - Family Support Day
(15, 2),
(15, 4);