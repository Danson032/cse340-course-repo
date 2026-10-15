// Shared authentication middleware used by the organization, project, and category routes.
// The implementation lives in the required user controller module.
export { requireLogin, requireRole } from "../controllers/user.js";
