
import pool from "./src/db.js";

try {
    const result = await pool.query(`
    UPDATE users
    SET role_id = (
      SELECT role_id
      FROM roles
      WHERE role_name = 'admin'
    )
    WHERE LOWER(email) = 'admin@example.com'
    RETURNING email;
  `);

    if (result.rows.length === 0) {
        console.log("Account not found. Register admin@example.com first.");
    } else {
        console.log("Administrator role assigned:", result.rows[0].email);
    }
} catch (error) {
    console.error("Database error:", error.message);
} finally {
    await pool.end();
}
