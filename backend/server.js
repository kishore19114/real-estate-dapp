const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "properties.json");
const PUBLIC_PATH = path.join(__dirname, "..", "public");

app.get("/api/properties", (_req, res) => {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  res.json(JSON.parse(raw));
});

app.use(express.static(PUBLIC_PATH));

const port = 12000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
