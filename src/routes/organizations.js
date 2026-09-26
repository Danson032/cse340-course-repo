import express from "express";
import { listOrganizations, showOrganization } from "../controllers/organizationsController.js";

const router = express.Router();

router.get("/organizations", listOrganizations);
router.get("/organization/:id", showOrganization);

export default router;
