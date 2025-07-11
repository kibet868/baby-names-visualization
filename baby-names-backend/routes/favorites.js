const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Middleware to extract user_id from token
const authenticate = require("../middleware/authenticate");

// GET all favorites for logged-in user
router.get("/", authenticate, (req, res) => {
  const userId = req.user.id;
  db.all("SELECT * FROM favorites WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add a favorite
router.post("/", authenticate, (req, res) => {
  const { name, year, gender } = req.body;
  const userId = req.user.id;
  db.run(
    "INSERT INTO favorites (user_id, name, year, gender) VALUES (?, ?, ?, ?)",
    [userId, name, year, gender],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, message: "Favorite saved" });
    }
  );
});

// DELETE a favorite
router.delete("/:id", authenticate, (req, res) => {
  const userId = req.user.id;
  const favId = req.params.id;
  db.run("DELETE FROM favorites WHERE id = ? AND user_id = ?", [favId, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Favorite deleted" });
  });
});

module.exports = router;
