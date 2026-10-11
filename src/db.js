import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing. Create a .env file and add your PostgreSQL connection string.",
  );
}

const databaseHost = new URL(databaseUrl).hostname.toLowerCase();
const isLocalDatabase =
  !databaseHost ||
  ["localhost", "127.0.0.1", "::1", "[::1]"].includes(databaseHost) ||
  databaseHost.endsWith(".localhost");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
});

export default pool;