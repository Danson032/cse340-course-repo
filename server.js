import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import categoriesRouter from "./src/routes/categories.js";
import organizationsRouter from "./src/routes/organizations.js";
import projectsRouter from "./src/routes/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const nodeEnvironment = process.env.NODE_ENV?.toLowerCase() || "production";

/**
 * Configure Express middleware
 */

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Routes
 */
app.get("/", async (request, response) => {
  response.render("home", { pageTitle: "Home" });
});
// mount routers
app.use(categoriesRouter);
app.use(organizationsRouter);
app.use(projectsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Not Found" });
});

// generic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("500", { pageTitle: "Server Error" });
});

const startServer = async () => {
  await app.listen(port);
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnvironment}`);
};

startServer();
