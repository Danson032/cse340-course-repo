// The required controller implementation lives at src/controllers/user.js.
// This wrapper keeps the existing W04 application routes compatible.
export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  requireRole,
  showDashboard,
  listUsers,
} from "../../../src/controllers/user.js";
