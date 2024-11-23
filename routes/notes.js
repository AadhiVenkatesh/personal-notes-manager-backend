const express = require("express");
const router = express.Router();
const db = require("../db");
const Joi = require("joi");

// Validation schema
const noteSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid("Work", "Personal", "Others").required(),
});

// Get all notes with optional filters
router.get("/", (req, res) => {
  let query = "SELECT * FROM notes";
  const { category, search } = req.query;

  const filters = [];
  if (category) {
    filters.push(`category = '${category}'`);
  }
  if (search) {
    filters.push(`title LIKE '%${search}%'`);
  }
  if (filters.length) {
    query += ` WHERE ${filters.join(" AND ")}`;
  }

  query += " ORDER BY created_at DESC";

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Create a new note
router.post("/", (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, description, category } = value;
  db.run(
    `INSERT INTO notes (title, description, category) VALUES (?, ?, ?)`,
    [title, description, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update a note
router.put("/:id", (req, res) => {
  const { error, value } = noteSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, description, category } = value;
  const { id } = req.params;
  db.run(
    `UPDATE notes SET title = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [title, description, category, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Delete a note
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM notes WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
