// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// DB file path
const DB_PATH = path.join(__dirname, "realestate.db");

// Open connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("❌ Database connection error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    value TEXT NOT NULL
  )
`);

module.exports = db;
