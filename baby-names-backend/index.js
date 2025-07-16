 // backend/index.js

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const namesRoutes = require("./routes/names");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

// ========= DATABASE =========
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to SQLite:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ========= TABLES =========
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    year INTEGER,
    count INTEGER
  )
`);

app.locals.db = db;

// ========= MIDDLEWARE =========
app.use(cors({
  origin: ["http://localhost:3000", "https://kibet868.github.io"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// ========= ROUTES =========
app.use("/api", authRoutes);
app.use("/api", namesRoutes);
app.use("/api", adminRoutes);

// ========= DEFAULT ROUTE =========
app.get("/", (req, res) => {
  res.send("✅ Baby Names Backend API is running.");
});

// ========= ERROR HANDLER =========
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ========= START SERVER =========
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`);
});
