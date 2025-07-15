 // db/seed.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "baby_names.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error("❌ Failed to connect to database:", err.message);
  }
  console.log("✅ Connected to baby_names.db");
});

const sampleData = [
  { name: "Emma", gender: "F", year: 2020, count: 17500 },
  { name: "Emma", gender: "F", year: 2021, count: 18000 },
  { name: "Emma", gender: "F", year: 2022, count: 19000 },
  { name: "Noah", gender: "M", year: 2020, count: 16000 },
  { name: "Noah", gender: "M", year: 2021, count: 17500 },
  { name: "Noah", gender: "M", year: 2022, count: 18500 },
  { name: "Liam", gender: "M", year: 2021, count: 17000 },
  { name: "Olivia", gender: "F", year: 2021, count: 18500 },
  { name: "Ava", gender: "F", year: 2022, count: 17800 },
  { name: "Ethan", gender: "M", year: 2022, count: 16800 },
];

db.serialize(() => {
  // ✅ Create baby_names table
  db.run(
    `CREATE TABLE IF NOT EXISTS baby_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      year INTEGER NOT NULL,
      count INTEGER NOT NULL
    )`,
    (err) => {
      if (err) {
        return console.error("❌ Failed to create baby_names table:", err.message);
      }
      console.log("✅ baby_names table created.");
    }
  );

  // ⚠️ Clear old baby name data
  db.run(`DELETE FROM baby_names`, (err) => {
    if (err) {
      return console.error("❌ Could not clear baby_names data:", err.message);
    }
    console.log("⚠️  Old baby_names data cleared.");
  });

  // ✅ Insert sample data
  const stmt = db.prepare(
    `INSERT INTO baby_names (name, gender, year, count) VALUES (?, ?, ?, ?)`
  );

  sampleData.forEach(({ name, gender, year, count }) => {
    stmt.run(name, gender, year, count);
  });

  stmt.finalize(() => {
    console.log("✅ Sample baby name data inserted.");
  });

  // ✅ Create users table if not exists
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )`,
    (err) => {
      if (err) return console.error("❌ Failed to create users table:", err.message);
      console.log("✅ users table checked/created.");
    }
  );

  // ✅ Create favorites table if not exists
  db.run(
    `CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      year INTEGER,
      gender TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    (err) => {
      if (err) return console.error("❌ Failed to create favorites table:", err.message);
      console.log("✅ favorites table created.");
    }
  );

  // 🔒 Close DB
  db.close(() => {
    console.log("🔒 DB connection closed.");
  });
});
