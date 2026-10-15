// The required model implementation lives at src/models/user.js.
// This wrapper preserves compatibility with the W04 project structure.
export {
  createUser,
  findUserByEmail,
  verifyPassword,
  authenticateUser,
  getAllUsers,
} from "../../../src/models/user.js";
