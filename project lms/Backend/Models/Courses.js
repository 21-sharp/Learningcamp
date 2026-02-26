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

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String
}, { timestamps: true });

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
  sections: [sectionSchema],
  reviews: [reviewSchema],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
