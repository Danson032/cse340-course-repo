import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pool from "../src/db.js";

const schemaPath = new URL("../src/volunteers-schema.sql", import.meta.url);

try {
  const sql = await readFile(fileURLToPath(schemaPath), "utf8");
  await pool.query(sql);
  console.log("Volunteer signup table is ready.");
} catch (error) {
  console.error("Volunteer database setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
