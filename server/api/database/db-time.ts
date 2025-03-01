// server/api/db-time.ts
import { defineEventHandler } from "h3";
import pkg from "pg";

// Use this syntax for CommonJS modules in ESM context
const { Client } = pkg;

export default defineEventHandler(async (event) => {
  const client = new Client(process.env.DATABASE_URL);

  try {
    await client.connect();
    const results = await client.query("SELECT NOW()");
    return {
      time: results.rows[0].now,
    };
  } catch (err: any) {
    console.error("error executing query:", err);
    return { error: "Database query failed", message: err.message };
  } finally {
    await client.end();
  }
});
