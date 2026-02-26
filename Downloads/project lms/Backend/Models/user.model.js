import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "student"
    },
    profileImage: {
      type: String,
      default: ""
    },
    completedCourses: {
      type: Number,
      default: 0
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    points: {
      type: Number,
      default: 0
    },
    badges: [
      {
        type: String
      }
    ]

  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
