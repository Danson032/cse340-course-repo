import {
    getAllProjects,
    getProjectById,
} from "../models/projects.js";

import { getCategoriesByProjectId } from "../models/categories.js";

export const listProjects = async (req, res) => {
    try {
        const projects = await getAllProjects();

        res.render("projects", {
            pageTitle: "Projects",
            projects,
        });
    } catch (error) {
        console.error("Error loading projects:", error);

        res.status(500).render("500", {
            pageTitle: "Server Error",
        });
    }
};

export const showProject = async (req, res) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(404).render("404", {
                pageTitle: "Not Found",
            });
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).render("404", {
                pageTitle: "Not Found",
            });
        }

        const categories = await getCategoriesByProjectId(projectId);

        let projectDate = "TBA";

        if (project.project_date) {
            const date = new Date(project.project_date);

            if (!Number.isNaN(date.getTime())) {
                projectDate = date.toDateString();
            }
        }

        const formattedProject = {
            ...project,
            project_date_display: projectDate,
        };

        res.render("project", {
            pageTitle: project.project_name,
            project: formattedProject,
            categories,
        });
    } catch (error) {
        console.error("Error loading project:", error);

        res.status(500).render("500", {
            pageTitle: "Server Error",
        });
    }
};