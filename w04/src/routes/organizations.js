import express from "express";
import {
  listOrganizations,
  showOrganization,
  showNewOrganization,
  createNewOrganization,
  showEditOrganization,
  editOrganization,
} from "../controllers/organizationsController.js";

const router = express.Router();

router.get("/organizations", listOrganizations);
router.get("/organization/:id", showOrganization);

router.get("/new-organization", showNewOrganization);
router.post("/new-organization", createNewOrganization);

router.get("/edit-organization/:id", showEditOrganization);
router.post("/edit-organization/:id", editOrganization);

export default router;
