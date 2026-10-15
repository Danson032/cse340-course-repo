
import express from "express";

import {
  listProjects,
  showProject,
  showNewProject,
  createNewProject,
  showEditProject,
  editProject,
  volunteerForProject,
  removeVolunteerSignup,
} from "../controllers/projectsController.js";

import { requireLogin, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/projects", listProjects);
router.get("/project/:id", showProject);
router.post("/project/:id/volunteer", requireLogin, volunteerForProject);
router.post("/project/:id/unvolunteer", requireLogin, removeVolunteerSignup);

// Admin-only project creation
router.get("/new-project", requireRole("admin"), showNewProject);
router.post("/new-project", requireRole("admin"), createNewProject);

// Admin-only project editing
router.get("/edit-project/:id", requireRole("admin"), showEditProject);
router.post("/edit-project/:id", requireRole("admin"), editProject);

export default router;
