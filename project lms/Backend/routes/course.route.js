import express from "express";
import Course from "../Models/Courses.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("enrolledStudents", "fullName profileImage");
    res.json(course);
  } catch (err) {
    res.status(404).json({ message: "Course not found" });
  }
});

router.post("/:id/reviews", async (req, res) => {
  try {
    const { userId, userName, rating, comment } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.reviews.push({ userId, userName, rating, comment });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
