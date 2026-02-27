import express from "express";
import Exam from "../Models/Exam.js";

const router = express.Router();

// Get exam questions by course id
router.get("/:courseId", async (req, res) => {
  try {
    const exam = await Exam.findOne({ course: req.params.courseId });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam.questions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
