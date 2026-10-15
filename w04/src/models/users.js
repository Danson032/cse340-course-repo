// Keep the older model entry point backed by the canonical implementation.
export {
  createUser,
  findUserByEmail,
  findUserByEmail as getUserByEmail,
  verifyPassword,
  authenticateUser,
  getAllUsers,
} from "../../../src/models/user.js";
