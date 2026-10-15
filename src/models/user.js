import bcrypt from "bcrypt";
import pool from "../db.js";

function withoutPasswordHash(user) {
  if (!user) return null;
  const { password_hash, passwordHash, ...safeUser } = user;
  return safeUser;
}

async function findUserRecordByEmail(email) {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.name,
       u.email,
       u.password_hash,
       u.role_id,
       r.role_name
     FROM users u
     JOIN roles r ON r.role_id = u.role_id
     WHERE LOWER(u.email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] || null;
}

export async function createUser({ name, email, passwordHash }) {
  if (!name || !email || !passwordHash) {
    throw new TypeError("Name, email, and password hash are required.");
  }

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES (
       $1,
       LOWER($2),
       $3,
       (SELECT role_id FROM roles WHERE role_name = 'user')
     )
     RETURNING user_id, name, email, created_at`,
    [name.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return withoutPasswordHash(result.rows[0]);
}

export async function findUserByEmail(email) {
  if (typeof email !== "string" || !email.trim()) return null;
  const user = await findUserRecordByEmail(email.trim().toLowerCase());
  return withoutPasswordHash(user);
}

export async function verifyPassword(password, passwordHash) {
  if (typeof password !== "string" || typeof passwordHash !== "string") {
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}

export async function authenticateUser(email, password) {
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return null;
  }

  const user = await findUserRecordByEmail(email.trim().toLowerCase());
  if (!user) return null;

  const passwordMatches = await verifyPassword(password, user.password_hash);
  if (!passwordMatches) return null;

  return withoutPasswordHash(user);
}

export async function getAllUsers() {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.name,
       u.email,
       r.role_name,
       u.created_at
     FROM users u
     JOIN roles r ON r.role_id = u.role_id
     ORDER BY u.created_at DESC`
  );

  return result.rows.map(withoutPasswordHash);
}
