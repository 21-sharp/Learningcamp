import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name should be less than 50 characters"],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "admin"]
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
    ],
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationOTP: {
      type: String,
      select: false
    },
    emailVerificationExpiry: {
      type: Date,
      select: false
    },

    // Password reset fields
    forgotPasswordToken: {
      type: String,
      select: false
    },
    forgotPasswordExpiry: {
      type: Date,
      select: false
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
