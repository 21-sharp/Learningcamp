import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { ENV } from "../config/env.js";

export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.path : ""
    });

    console.log("Saved user:", newUser);

    // Send welcome email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        let transporter = nodemailer.createTransport({
          service: "gmail", // Adjust based on env, e.g., 'gmail'
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"LMS Platform" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to Our LMS Platform!",
          html: `<h2>Hello ${fullName},</h2><p>Welcome to our Learning Management System. We are excited to have you on board!</p>`,
        });
        console.log("Welcome email sent to:", email);
      } catch (emailError) {
        console.log("Error sending welcome email:", emailError);
      }
    } else {
      console.log("Skipping welcome email: EMAIL_USER or EMAIL_PASS not configured in .env");
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        points: user.points,
        badges: user.badges,
        enrolledCourses: user.enrolledCourses,
      }
    });

  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const EditProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    // Auth middleware attaches req.user
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (req.file) updateData.profileImage = req.file.path; // Multer-Cloudinary image path

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("EditProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const EnrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if already enrolled
    if (user.enrolledCourses.some(id => id.toString() === courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    const populatedUser = await User.findById(user._id).populate("enrolledCourses");

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      user: {
        _id: populatedUser._id,
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        enrolledCourses: populatedUser.enrolledCourses
      }
    });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const GetUserDetails = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id)
      .populate("enrolledCourses")
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("GetUserDetails error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const UpdatePoints = async (req, res) => {
  try {
    const { points, badge } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points || 0;
    if (badge && !user.badges.includes(badge)) {
      user.badges.push(badge);
    }

    await user.save();

    res.status(200).json({ success: true, points: user.points, badges: user.badges });
  } catch (error) {
    console.error("UpdatePoints error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
