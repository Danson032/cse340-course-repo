import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { getAllCategories } from "./src/models/categories.js";
import { getAllOrganizations } from "./src/models/organizations.js";
import { getAllProjects } from "./src/models/projects.js";

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

app.get("/organizations", async (request, response) => {
  try {
    const organizations = await getAllOrganizations();
    response.render("organizations", {
      pageTitle: "Organizations",
      organizations,
    });
  } catch (error) {
    console.error("Error loading organizations:", error);
    response.status(500).send("Unable to load organizations.");
  }
});

app.get("/projects", async (request, response) => {
  try {
    const projects = await getAllProjects();
    response.render("projects", { pageTitle: "Projects", projects });
  } catch (error) {
    console.error("Error loading projects:", error);
    response.status(500).send("Unable to load projects.");
  }
});

app.get("/categories", async (request, response) => {
  try {
    const categories = await getAllCategories();
    response.render("categories", { pageTitle: "Categories", categories });
  } catch (error) {
    console.error("Error loading categories:", error);
    response.status(500).send("Unable to load categories.");
  }
});

const startServer = async () => {
  await app.listen(port);
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnvironment}`);
};

startServer();
