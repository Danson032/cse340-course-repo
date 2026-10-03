import express from "express";
import {
  listProjects,
  showProject,
  showNewProject,
  createNewProject,
  showEditProject,
  editProject,
} from "../controllers/projectsController.js";

const router = express.Router();

router.get("/projects", listProjects);
router.get("/project/:id", showProject);

router.get("/new-project", showNewProject);
router.post("/new-project", createNewProject);

router.get("/edit-project/:id", showEditProject);
router.post("/edit-project/:id", editProject);

export default router;
