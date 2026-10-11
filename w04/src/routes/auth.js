
import express from "express";

import {
    showRegister,
    register,
    showLogin,
    login,
    logout,
    showDashboard,
    listUsers,
} from "../controllers/authController.js";

import {
    requireLogin,
    requireRole,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/register", showRegister);
router.post("/register", register);

router.get("/login", showLogin);
router.post("/login", login);

router.post("/logout", requireLogin, logout);

router.get("/dashboard", requireLogin, showDashboard);

router.get("/users", requireRole("admin"), listUsers);

export default router;
