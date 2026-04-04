// const express = require("express");
// const router = express.Router();
// const { addStudent, getStudents, deleteStudent } = require("../controllers/studentController");

// // ➕ Add student
// router.post("/add", addStudent);

// // 📥 Get students
// router.get("/", getStudents);
// router.delete("/:id", deleteStudent);
// router.put("/students/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error } = await supabase
//     .from("students")
//     .update(req.body)
//     .eq("id", id);

//   if (error) return res.status(500).json(error);

//   res.json({ message: "Updated" });
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

const { addStudent, getStudents, deleteStudent } = require("../controllers/studentController");

// ➕ Add student
router.post("/add", addStudent);

// 📥 Get students
router.get("/", getStudents);

// ❌ Delete
router.delete("/:id", deleteStudent);

// ✏️ Update
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("students")
    .update(req.body)
    .eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Updated" });
});

module.exports = router;