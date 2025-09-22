const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PUBLIC_PATH = path.join(__dirname, "..", "public");

// ---------- API ROUTES ---------- //

// Get all properties
app.get("/api/properties", (req, res) => {
  db.all("SELECT * FROM properties", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add new property
app.post("/api/properties", (req, res) => {
  const { name, location, value } = req.body;
  if (!name || !location || !value) {
    return res.status(400).json({ error: "All fields required" });
  }
  db.run(
    `INSERT INTO properties (name, location, value) VALUES (?, ?, ?)`,
    [name, location, value],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, location, value });
    }
  );
});

// Delete property by ID
app.delete("/api/properties/:id", (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM properties WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// Serve frontend
app.use(express.static(PUBLIC_PATH));

const port = 1200;
app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
