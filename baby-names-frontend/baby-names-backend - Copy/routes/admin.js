 // routes/admin.js
const express = require("express");
const multer = require("multer");
const db = require("../db/db");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/admin/upload", upload.single("dataset"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = req.file.path;

  fs.readFile(filePath, "utf8", (err, content) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read uploaded file." });
    }

    try {
      const data = JSON.parse(content);

      if (!Array.isArray(data)) {
        return res.status(400).json({ message: "Uploaded JSON must be an array." });
      }

      const stmt = db.prepare(
        "INSERT INTO baby_names (name, gender, year, count) VALUES (?, ?, ?, ?)"
      );

      data.forEach((item) => {
        const { name, gender, year, count } = item;

        if (!name || !gender || !year || !count) {
          console.warn("Skipping invalid row:", item);
          return;
        }

        stmt.run(name, gender, year, count, (err) => {
          if (err) {
            console.error("Insert error:", err.message);
          }
        });
      });

      stmt.finalize(() => {
        res.json({ message: "✅ File uploaded and baby name data inserted." });
      });
    } catch (parseErr) {
      console.error("Invalid JSON:", parseErr.message);
      res.status(400).json({ message: "❌ Invalid JSON format in uploaded file." });
    }
  });
});

module.exports = router;
