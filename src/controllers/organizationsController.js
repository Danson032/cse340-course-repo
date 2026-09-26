import { getAllOrganizations, getOrganizationById, getProjectsByOrganizationId } from "../models/organizations.js";

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
        const orgId = Number(req.params.id);
        const organization = await getOrganizationById(orgId);

        if (!organization) {
            return res.status(404).render("404", { pageTitle: "Not Found" });
        }

        const projects = await getProjectsByOrganizationId(orgId);

        res.render("organization", { pageTitle: `Organization: ${organization.organization_name}`, organization, projects });
    } catch (error) {
        console.error("Error loading organization:", error);
        res.status(500).render("500", { pageTitle: "Server Error" });
    }
};
