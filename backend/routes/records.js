const express = require("express");
const router = express.Router();

let records = [
  { id: 1, name: "Project A", student: "Ashish", year: 2026 },
  { id: 2, name: "Project B", student: "Bhaviik", year: 2026 },
  { id: 3, name: "Project C", student: "Sweety", year: 2026 },
];

// GET ALL
router.get("/", (req, res) => {
  res.json(records);
});

// GET BY ID
router.get("/:id", (req, res) => {
  const record = records.find((r) => r.id === parseInt(req.params.id));

  if (!record) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(record);
});

// CREATE
router.post("/", (req, res) => {
  const { name, student, year } = req.body;
  const newId = records.length > 0 ? records[records.length - 1].id + 1 : 1;
  const newRecord = {
    id: newId,
    name,
    student,
    year,
  };

  records.push(newRecord);
  res.status(201).json(newRecord);
});

// UPDATE
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, student, year } = req.body;
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  records[index] = { id, name, student, year };
  res.json(records[index]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  const deleted = records.splice(index, 1)[0];
  res.json(deleted);
});

module.exports = router;
