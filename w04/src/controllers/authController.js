
import bcrypt from "bcrypt";
import {
    createUser,
    getUserByEmail,
    getAllUsers,
} from "../models/users.js";

export function showRegister(req, res) {
    res.render("register", {
        title: "Register",
        error: null,
        formData: {},
    });
}

export async function register(req, res, next) {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";
        const confirmPassword = req.body.confirmPassword || "";

        const formData = { name, email };
        let error = null;

        if (!name || !email || !password || !confirmPassword) {
            error = "Please complete all fields.";
        } else if (name.length > 100) {
            error = "Name must be 100 characters or fewer.";
        } else if (email.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
                    name: (req.body.name || "").trim(),
                    email: (req.body.email || "").trim(),
                },
            });
        }

        return next(error);
    }
}

export function showLogin(req, res) {
    res.render("login", {
        title: "Login",
        error: null,
    });
}

export async function login(req, res, next) {
    try {
        const email = (req.body.email || "").trim();
        const password = req.body.password || "";

        if (!email || !password) {
            return res.status(400).render("login", {
                title: "Login",
                error: "Please enter your email and password.",
            });
        }

        const user = await getUserByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).render("login", {
                title: "Login",
                error: "Invalid email or password.",
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

export function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) return next(error);

        res.clearCookie("cse340.sid");
        return res.redirect("/login?loggedOut=1");
    });
}

export function showDashboard(req, res) {
    res.render("dashboard", {
        title: "Dashboard",
        currentUser: req.session.user,
        forbidden: req.query.error === "forbidden",
    });
}

export async function listUsers(req, res, next) {
    try {
        const users = await getAllUsers();

        res.render("users", {
            title: "Registered Users",
            users,
        });
    } catch (error) {
        return next(error);
    }
}
