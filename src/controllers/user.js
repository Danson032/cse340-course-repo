import bcrypt from "bcrypt";
import {
  createUser,
  authenticateUser,
  getAllUsers,
} from "../models/user.js";
import { getVolunteeredProjectsByUserId } from "../models/projects.js";

export function showUserRegistrationForm(req, res) {
  return res.render("register", {
    title: "Register",
    error: null,
    formData: {},
  });
}

export async function processUserRegistrationForm(req, res, next) {
  try {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const confirmPassword =
      typeof body.confirmPassword === "string" ? body.confirmPassword : "";

    const formData = { name, email };
    let error = null;

    if (!name || !email || !password || !confirmPassword) {
      error = "Please complete all fields.";
    } else if (name.length > 100) {
      error = "Name must be 100 characters or fewer.";
    } else if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      error = "Please enter a valid email address.";
    } else if (password.length < 6) {
      error = "Password must contain at least 6 characters.";
    } else if (password !== confirmPassword) {
      error = "Passwords do not match.";
    }

    if (error) {
      return res.status(400).render("register", {
        title: "Register",
        error,
        formData,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await createUser({ name, email, passwordHash });

    return res.redirect("/login?registered=1");
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).render("register", {
        title: "Register",
        error: "An account with that email already exists.",
        formData: {
          name: typeof req.body?.name === "string" ? req.body.name.trim() : "",
          email: typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "",
        },
      });
    }

    return next(error);
  }
}

export function showLoginForm(req, res) {
  return res.render("login", {
    title: "Login",
    error:
      req.query.error === "forbidden"
        ? "You do not have permission to access that page."
        : null,
    query: req.query,
  });
}

export async function processLoginForm(req, res, next) {
  try {
    const body = req.body || {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return res.status(400).render("login", {
        title: "Login",
        error: "Please enter your email and password.",
        query: req.query,
      });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).render("login", {
        title: "Login",
        error: "Invalid email or password.",
        query: req.query,
      });
    }

    req.session.regenerate((sessionError) => {
      if (sessionError) return next(sessionError);

      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_name: user.role_name,
      };

      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    return next(error);
  }
}

export function processLogout(req, res, next) {
  if (!req.session) return res.redirect("/login");

  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("cse340.sid");
    return res.redirect("/login?loggedOut=1");
  });
}

export function requireLogin(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect("/login");
}

export function requireRole(requiredRole) {
  return function roleAuthorization(req, res, next) {
    if (!req.session?.user) return res.redirect("/login");
    if (req.session.user.role_name !== requiredRole) {
      return res.redirect("/dashboard?error=forbidden");
    }
    return next();
  };
}

export async function showDashboard(req, res, next) {
  try {
    const currentUser = req.session.user;
    const volunteeredProjects = await getVolunteeredProjectsByUserId(
      currentUser.user_id,
    );

    return res.render("dashboard", {
      title: "Dashboard",
      currentUser,
      volunteeredProjects,
      forbidden: req.query.error === "forbidden",
    });
  } catch (error) {
    return next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await getAllUsers();
    return res.render("users", {
      title: "Registered Users",
      users,
    });
  } catch (error) {
    return next(error);
  }
}
