 // db/db.js
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// ✅ Use current folder path
const dbPath = path.join(__dirname, "../baby-names.db"); // stays in root of backend

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to the database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// Optional: Check for 'role' column
db.all("PRAGMA table_info(users)", (err, rows) => {
  if (err) {
    console.error("❌ Error checking users table:", err.message);
    return;
  }

  const hasRole = rows.some((col) => col.name === "role");
  if (!hasRole) {
    db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
      if (err) console.error("❌ Failed to add role column:", err.message);
      else console.log("✅ 'role' column added to users table.");
    });
  } else {
    console.log("✅ 'role' column already exists in users table.");
  }
});

module.exports = db;
