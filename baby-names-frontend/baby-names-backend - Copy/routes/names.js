 const express = require("express");
const router = express.Router(); // ✅ This line was missing
const db = require("../db/db");  // Adjust path if needed

// ==========================
// GET /api/names
// ==========================

router.get("/names", (req, res) => {
  const query = `
    SELECT name, year, count 
    FROM baby_names 
    ORDER BY name ASC, year ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ Failed to fetch baby names:", err.message);
      return res.status(500).json({ message: "Database error while fetching names" });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No baby name data found" });
    }

    res.json(rows);
  });
});

module.exports = router;
