// db/init-users.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

// Point to the correct DB file
const dbPath = path.join(__dirname, "baby-names.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error("❌ Could not connect:", err.message);
  console.log("✅ Connected to SQLite for user setup");
});

// Create users table and insert default user
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `, (err) => {
    if (err) return console.error("❌ Table creation failed:", err.message);
    console.log("✅ Users table created.");
  });

  const passwordHash = bcrypt.hashSync("1234", 10); // 👈 change password if needed

  db.run(
    `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
    ["admin", "manwellkibet@gmail.com", passwordHash, "admin"],
    (err) => {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          console.log("⚠️ Admin user already exists.");
        } else {
          console.error("❌ Failed to insert admin:", err.message);
        }
      } else {
        console.log("✅ Admin user inserted.");
      }
      db.close(() => console.log("🔒 DB connection closed."));
    }
  );
});
