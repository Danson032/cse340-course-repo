import express from "express";
import { fileURLToPath } from "url";
import path from "path";

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
  response.render("organizations", { pageTitle: "Organizations" });
});

app.get("/projects", async (request, response) => {
  response.render("projects", { pageTitle: "Projects" });
});

app.get("/categories", async (request, response) => {
  response.render("categories", { pageTitle: "Categories" });
});

const startServer = async () => {
  await app.listen(port);
  console.log(`Server is running at http://127.0.0.1:${port}`);
  console.log(`Environment: ${nodeEnvironment}`);
};

startServer();
