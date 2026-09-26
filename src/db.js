import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Validate DATABASE_URL early and provide a clear diagnostic message when missing
const dbUrl = process.env.DATABASE_URL;
let pool;
if (!dbUrl || typeof dbUrl !== "string" || dbUrl.trim() === "") {
  const message =
    "Missing or invalid DATABASE_URL environment variable.\n" +
    "Create a .env file from .env.example and set DATABASE_URL=postgresql://username:password@host:5432/database_name\n" +
    "Do NOT commit your .env file. If your password contains special characters, URL-encode them.";

  console.error(message);

  // Dummy pool that fails queries with a clear error message.
  pool = {
    query: async () => {
      throw new Error(message);
    },
    connect: async () => {
      throw new Error(message);
    },
  };
} else {
  pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
}

export default pool;
