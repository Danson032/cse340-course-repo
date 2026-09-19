import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const setupFile = path.join(projectRoot, "src", "setup.sql");

if (!process.env.DATABASE_URL) {
  console.error("Database setup failed: DATABASE_URL is not set.");
  process.exitCode = 1;
} else {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const sql = await readFile(setupFile, "utf8");

    if (!sql.trim()) {
      throw new Error(`SQL setup file is empty: ${setupFile}`);
    }

    await client.connect();
    await client.query(sql);
    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}
