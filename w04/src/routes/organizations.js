
import express from "express";

import {
  listOrganizations,
  showOrganization,
  showNewOrganization,
  createNewOrganization,
  showEditOrganization,
  editOrganization,
} from "../controllers/organizationsController.js";

import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/organizations", listOrganizations);
router.get("/organization/:id", showOrganization);

// Admin-only organization creation
router.get(
  "/new-organization",
  requireRole("admin"),
  showNewOrganization
);

router.post(
  "/new-organization",
  requireRole("admin"),
  createNewOrganization
);

// Admin-only organization editing
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganization
);

router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  editOrganization
);

export default router;
