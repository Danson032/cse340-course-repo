
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pool from "../src/db.js";

const schemaPath = new URL("../src/auth-schema.sql", import.meta.url);

try {
    const sql = await readFile(fileURLToPath(schemaPath), "utf8");
    await pool.query(sql);
    console.log("Authentication tables and roles created successfully.");
} catch (error) {
    console.error("Authentication database setup failed:", error.message);
    process.exitCode = 1;
} finally {
    await pool.end();
}
