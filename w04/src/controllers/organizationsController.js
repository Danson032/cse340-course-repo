import {
  getAllOrganizations,
  getOrganizationById,
  getProjectsByOrganizationId,
  createOrganization,
  updateOrganization,
} from "../models/organizations.js";

const validateOrganization = (body) => {
  const organization = {
    organization_name:
      typeof body.organization_name === "string"
        ? body.organization_name.trim()
        : "",
    organization_description:
      typeof body.organization_description === "string"
        ? body.organization_description.trim()
        : "",
    website:
      typeof body.website === "string" ? body.website.trim() : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
  };

  const errors = [];

  if (!organization.organization_name) {
    errors.push("Organization name is required.");
  } else if (organization.organization_name.length > 255) {
    errors.push("Organization name must not exceed 255 characters.");
  }

  if (!organization.organization_description) {
    errors.push("Organization description is required.");
  } else if (organization.organization_description.length > 5000) {
    errors.push("Organization description must not exceed 5000 characters.");
  }

  if (!organization.website) {
    errors.push("Website is required.");
  } else if (organization.website.length > 255) {
    errors.push("Website must not exceed 255 characters.");
  } else {
    try {
      const website = new URL(organization.website);
      if (website.protocol !== "http:" && website.protocol !== "https:") {
        errors.push("Website must use http or https.");
      }
    } catch {
      errors.push("Website must be a valid URL.");
    }
  }

  if (!organization.email) {
    errors.push("Email is required.");
  } else if (organization.email.length > 255) {
    errors.push("Email must not exceed 255 characters.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.email)) {
    errors.push("Email must be a valid email address.");
  }

  return { organization, errors };
};

export const listOrganizations = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { pageTitle: "Organizations", organizations });
  } catch (error) {
    console.error("Error loading organizations:", error);
    res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showOrganization = async (req, res) => {
  try {
    const organizationId = Number(req.params.id);

    if (!Number.isInteger(organizationId) || organizationId <= 0) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const organization = await getOrganizationById(organizationId);

    if (!organization) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    const projects = await getProjectsByOrganizationId(organizationId);

    res.render("organization", {
      pageTitle: organization.organization_name,
      organization,
      projects,
    });
  } catch (error) {
    console.error("Error loading organization:", error);
    res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showNewOrganization = (req, res) => {
  res.render("new-organization", {
    pageTitle: "Create New Organization",
    organization: {
      organization_name: "",
      organization_description: "",
      website: "",
      email: "",
    },
    errors: [],
  });
};

export const createNewOrganization = async (req, res) => {
  const { organization, errors } = validateOrganization(req.body);

  if (errors.length) {
    return res.status(400).render("new-organization", {
      pageTitle: "Create New Organization",
      organization,
      errors,
    });
  }

  try {
    const created = await createOrganization(organization);
    res.flash("Organization created successfully.");
    return res.redirect(`/organization/${created.organization_id}`);
  } catch (error) {
    console.error("Error creating organization:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const showEditOrganization = async (req, res) => {
  const organizationId = Number(req.params.id);

  if (!Number.isInteger(organizationId) || organizationId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  try {
    const organization = await getOrganizationById(organizationId);

    if (!organization) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    return res.render("edit-organization", {
      pageTitle: `Edit ${organization.organization_name}`,
      organization,
      errors: [],
    });
  } catch (error) {
    console.error("Error loading edit organization page:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};

export const editOrganization = async (req, res) => {
  const organizationId = Number(req.params.id);

  if (!Number.isInteger(organizationId) || organizationId <= 0) {
    return res.status(404).render("404", { pageTitle: "Not Found" });
  }

  const { organization, errors } = validateOrganization(req.body);

  if (errors.length) {
    organization.organization_id = organizationId;
    return res.status(400).render("edit-organization", {
      pageTitle: "Edit Organization",
      organization,
      errors,
    });
  }

  try {
    const updated = await updateOrganization(organizationId, organization);

    if (!updated) {
      return res.status(404).render("404", { pageTitle: "Not Found" });
    }

    res.flash("Organization updated successfully.");
    return res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    console.error("Error updating organization:", error);
    return res.status(500).render("500", { pageTitle: "Server Error" });
  }
};
