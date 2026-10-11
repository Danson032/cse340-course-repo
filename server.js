
import express from "express";
import "dotenv/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { fileURLToPath } from "node:url";
import path from "node:path";

import pool from "./src/db.js";
import authRouter from "./w04/src/routes/auth.js";
import categoriesRouter from "./w04/src/routes/categories.js";
import organizationsRouter from "./w04/src/routes/organizations.js";
import projectsRouter from "./w04/src/routes/projects.js";
import { flashMiddleware } from "./w04/src/flash.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from the environment.");
}

const PgSessionStore = connectPgSimple(session);

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "cse340.sid",
    store: new PgSessionStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session?.user || null;
  next();
});

app.use(flashMiddleware);
app.use(express.static(path.join(__dirname, "w04", "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "w04", "views"));

app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Home",
  });
});

app.use(authRouter);
app.use(categoriesRouter);
app.use(organizationsRouter);
app.use(projectsRouter);

app.use((req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled application error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).render("500", {
    pageTitle: "Server Error",
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
