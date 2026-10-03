import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
} from "../models/projects.js";
import { getCategoriesByProjectId, getAllCategories } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";

const getCategoryIds = (value) => {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(
    values
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0),
  )];
};

const validateProject = (body) => {
  const project = {
    project_name: typeof body.project_name === "string" ? body.project_name.trim() : "",
    project_description:
      typeof body.project_description === "string"
        ? body.project_description.trim()
        : "",
    project_date: typeof body.project_date === "string" ? body.project_date : "",
    location: typeof body.location === "string" ? body.location.trim() : "",
    organization_id: Number(body.organization_id),
  };

  const categoryIds = getCategoryIds(body.category_ids);
  const errors = [];

  if (!project.project_name) errors.push("Project name is required.");
  else if (project.project_name.length > 255) {
    errors.push("Project name must not exceed 255 characters.");
  }

  if (!project.project_description) {
    errors.push("Project description is required.");
  } else if (project.project_description.length > 5000) {
    errors.push("Project description must not exceed 5000 characters.");
  }

  if (!project.location) {
    errors.push("Location is required.");
  } else if (project.location.length > 255) {
    errors.push("Location must not exceed 255 characters.");
  }

  if (project.project_date) {
    const date = new Date(`${project.project_date}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(project.project_date) ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== project.project_date
    ) {
      errors.push("Project date must be valid.");
    }
  }

  if (!Number.isInteger(project.organization_id) || project.organization_id <= 0) {
    errors.push("A valid organization is required.");
  }

  if (categoryIds.length === 0) {
    errors.push("Select at least one category.");
  }

  return { project, categoryIds, errors };
};

const renderProjectForm = async (res, view, pageTitle, project, errors, status = 200) => {
  const [organizations, categories] = await Promise.all([
    getAllOrganizations(),
    getAllCategories(),
  ]);

  return res.status(status).render(view, {
    pageTitle,
    project,
    organizations,
    categories,
    selectedCategoryIds: project.selectedCategoryIds || [],
    errors,
  });
};

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

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const categories = await getCategoriesByProjectId(projectId);

    let projectDate = "TBA";
    if (project.project_date) {
      const date = new Date(project.project_date);
      if (!Number.isNaN(date.getTime())) projectDate = date.toDateString();
    }

    res.render("project", {
      pageTitle: project.project_name,
      project: { ...project, project_date_display: projectDate },
      categories,
    });
  } catch (error) {
    console.error("Error loading project:", error);
    res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showNewProject = async (req, res) => {
  const project = {
    project_name: "",
    project_description: "",
    project_date: "",
    location: "",
    organization_id: "",
    selectedCategoryIds: [],
  };

  try {
    return await renderProjectForm(
      res,
      "new-project",
      "Create New Service Project",
      project,
      [],
    );
  } catch (error) {
    console.error("Error loading new project page:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const createNewProject = async (req, res) => {
  const { project, categoryIds, errors } = validateProject(req.body);
  project.selectedCategoryIds = categoryIds;

  try {
    if (!errors.length) {
      const [organizations, categories] = await Promise.all([
        getAllOrganizations(),
        getAllCategories(),
      ]);
      if (!organizations.some((organization) => organization.organization_id === project.organization_id)) {
        errors.push("Select a valid organization.");
      }
      if (categoryIds.some((id) => !categories.some((category) => category.category_id === id))) {
        errors.push("Select only valid categories.");
      }
    }

    if (errors.length) {
      return await renderProjectForm(
        res,
        "new-project",
        "Create New Service Project",
        project,
        errors,
        400,
      );
    }

    const projectId = await createProject(project, categoryIds);
    res.flash("Project saved successfully.");
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showEditProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  try {
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const selectedCategories = await getCategoriesByProjectId(projectId);

    project.project_date = project.project_date
      ? new Date(project.project_date).toISOString().slice(0, 10)
      : "";
    project.selectedCategoryIds = selectedCategories.map((category) => category.category_id);

    return await renderProjectForm(
      res,
      "edit-project",
      `Edit ${project.project_name}`,
      project,
      [],
    );
  } catch (error) {
    console.error("Error loading edit project page:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const editProject = async (req, res) => {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const { project, categoryIds, errors } = validateProject(req.body);
  project.project_id = projectId;
  project.selectedCategoryIds = categoryIds;

  try {
    if (!errors.length) {
      const [organizations, categories] = await Promise.all([
        getAllOrganizations(),
        getAllCategories(),
      ]);
      if (!organizations.some((organization) => organization.organization_id === project.organization_id)) {
        errors.push("Select a valid organization.");
      }
      if (categoryIds.some((id) => !categories.some((category) => category.category_id === id))) {
        errors.push("Select only valid categories.");
      }
    }

    if (errors.length) {
      return await renderProjectForm(
        res,
        "edit-project",
        "Edit Service Project",
        project,
        errors,
        400,
      );
    }

    const updated = await updateProject(projectId, project, categoryIds);

    if (!updated) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    res.flash("Project saved successfully.");
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};
