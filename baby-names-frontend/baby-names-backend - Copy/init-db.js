 // init-db.js

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Define full path to database file
const dbPath = path.resolve(__dirname, "./db/babynames.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to open database:", err.message);
    return;
  }
  console.log("✅ Connected to SQLite database.");
});

db.serialize(() => {
  // Create baby_names table
  db.run(`
    CREATE TABLE IF NOT EXISTS baby_names (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT NOT NULL,
      year INTEGER NOT NULL,
      count INTEGER NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("❌ Failed to create table:", err.message);
      return;
    }
    console.log("✅ baby_names table created or already exists.");
  });

  // Insert sample data
  const sampleData = [
    ["Emma", "female", 2020, 18000],
    ["Emma", "female", 2021, 19000],
    ["Emma", "female", 2022, 21000],
    ["Emma", "female", 2023, 20000],
    ["Emma", "female", 2024, 22000],
    ["Noah", "male", 2020, 17000],
    ["Noah", "male", 2021, 18000],
    ["Noah", "male", 2022, 19000],
    ["Noah", "male", 2023, 18500],
    ["Noah", "male", 2024, 19500],
  ];

  const insertStmt = db.prepare(
    "INSERT INTO baby_names (name, gender, year, count) VALUES (?, ?, ?, ?)"
  );

  sampleData.forEach((row) => {
    insertStmt.run(row, (err) => {
      if (err) {
        console.error("❌ Insert failed:", err.message);
      }
    });
  });

  insertStmt.finalize(() => {
    console.log("✅ Sample data inserted successfully.");
    db.close();
  });
});
