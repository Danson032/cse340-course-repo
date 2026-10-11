
import pool from "../../../src/db.js";

export async function createUser({ name, email, passwordHash }) {
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role_id)
     VALUES (
       $1,
       LOWER($2),
       $3,
       (SELECT role_id FROM roles WHERE role_name = 'user')
     )
     RETURNING user_id, name, email, created_at`,
        [name, email, passwordHash]
    );

    return result.rows[0];
}

export async function getUserByEmail(email) {
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

    return result.rows;
}
