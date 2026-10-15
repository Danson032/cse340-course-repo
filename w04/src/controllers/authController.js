// Keep the older controller entry point backed by the canonical implementation.
export {
  showUserRegistrationForm as showRegister,
  processUserRegistrationForm as register,
  showLoginForm as showLogin,
  processLoginForm as login,
  processLogout as logout,
  showDashboard,
  listUsers,
} from "../../../src/controllers/user.js";
