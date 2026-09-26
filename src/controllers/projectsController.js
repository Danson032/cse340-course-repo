import { getAllProjects, getProjectById } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";

export const listProjects = async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render("projects", { pageTitle: "Projects", projects });
    } catch (error) {
        console.error("Error loading projects:", error);
        res.status(500).render("500", { pageTitle: "Server Error" });
    }
};

export const showProject = async (req, res) => {
    try {
        const projectId = Number(req.params.id);
        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).render("404", { pageTitle: "Not Found" });
        }

        const categories = await getCategoriesByProjectId(projectId);

        // Normalize/format the project date for display. PostgreSQL DATE may be returned as string.
        const formattedProject = { ...project };
        if (formattedProject.project_date) {
            const d = new Date(formattedProject.project_date);
            if (!isNaN(d)) {
                formattedProject.project_date_display = d.toDateString();
            } else {
                formattedProject.project_date_display = formattedProject.project_date;
            }
        } else {
            formattedProject.project_date_display = null;
        }

        res.render("project", { pageTitle: `Project: ${project.project_name}`, project: formattedProject, categories });
    } catch (error) {
        console.error("Error loading project:", error);
        res.status(500).render("500", { pageTitle: "Server Error" });
    }
};
