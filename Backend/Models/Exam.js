import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      required: true
    }
  ],
  correctAnswer: {
    type: String,
    required: true
  }
});

const examSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    questions: {
      type: [questionSchema],
      validate: [arr => arr.length > 0, "Exam must contain at least 1 question"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
