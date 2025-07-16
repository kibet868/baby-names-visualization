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

// ========== DATABASE SETUP ==========
const dbPath = path.resolve(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Failed to connect to database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// Create `users` table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`,
  (err) => {
    if (err) console.error("❌ Error creating users table:", err.message);
  }
);

// Create `names` table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    year INTEGER,
    count INTEGER
  )`,
  (err) => {
    if (err) console.error("❌ Error creating names table:", err.message);
  }
);

// Make DB available to all routes
app.locals.db = db;

// ========== CORS SETUP ==========
app.use(cors({
  origin: "https://kibet868.github.io", // ✅ Allow frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: false
}));
app.options("*", cors()); // ✅ Preflight requests

// ========== MIDDLEWARE ==========
app.use(express.json());

// ========== ROUTES ==========
app.use("/api", authRoutes);    // /api/login, /api/register
app.use("/api", namesRoutes);   // /api/names
app.use("/api", adminRoutes);   // /api/upload, /api/admin/users etc.

// ========== DEPLOYMENT SUPPORT ==========
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../baby-names-frontend/build");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`);
});
