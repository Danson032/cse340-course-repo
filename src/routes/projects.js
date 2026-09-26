import express from "express";
import {
    listProjects,
    showProject,
} from "../controllers/projectsController.js";

const router = express.Router();

router.get("/projects", listProjects);
router.get("/project/:id", showProject);

export default router;