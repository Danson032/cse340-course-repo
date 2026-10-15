import express from "express";

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  listUsers,
} from "../controllers/user.js";

const router = express.Router();

router.get("/register", showUserRegistrationForm);
router.post("/register", processUserRegistrationForm);

router.get("/login", showLoginForm);
router.post("/login", processLoginForm);

router.post("/logout", requireLogin, processLogout);

router.get("/dashboard", requireLogin, showDashboard);
router.get("/users", requireRole("admin"), listUsers);

export default router;
