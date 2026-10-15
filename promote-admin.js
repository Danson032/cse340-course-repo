
import pool from "./src/db.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: node promote-admin.js <registered-email>");
  process.exitCode = 1;
} else {
  try {
    const result = await pool.query(
      `UPDATE users AS u
       SET role_id = r.role_id
       FROM roles AS r
       WHERE r.role_name = 'admin'
         AND LOWER(u.email) = $1
       RETURNING u.email`,
      [email],
    );

    if (result.rows.length === 0) {
      console.error(`Account not found: ${email}. Register that email first.`);
      process.exitCode = 1;
    } else {
      console.log("Administrator role assigned:", result.rows[0].email);
    }
  } catch (error) {
    console.error("Database error:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
