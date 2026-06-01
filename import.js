import fs from "fs";
import mysql from "mysql2/promise";

const db = await mysql.createConnection(process.env.DATABASE_URL);

const sql = fs.readFileSync("./dump.sql", "utf8");

const queries = sql
  .split(";")
  .map(q => q.trim())
  .filter(q => q.length > 0);

for (const query of queries) {
  try {
    await db.query(query);
    console.log("OK:", query.slice(0, 50));
  } catch (err) {
    console.error("ERREUR:", err.message);
  }
}

await db.end();