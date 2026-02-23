import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: String,
  description: String
});

const sectionSchema = new mongoose.Schema({
  title: String,
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  image: String, // thumbnail
  videoUrl: String, // main course video (YouTube embed URL)
  category: String,
  instructor: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  sections: [sectionSchema]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
