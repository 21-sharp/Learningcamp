import { User } from "../Models/user.model.js";
import Course from "../Models/Courses.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendLoginNotificationEmail,
  sendThankYouEmail,
} from "../utils/sendEmail.js";

// ==========================================
// REGISTER - Step 1: Send OTP
// ==========================================
export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate name length
    if (fullName.trim().length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    // Validate email format
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Validate password strength (min 8 chars, must have uppercase, lowercase, number)
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return res.status(400).json({
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      });
    }

    // Check for existing user
    const exist = await User.findOne({ email: email.toLowerCase() });
    if (exist && exist.isEmailVerified) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // If unverified user exists, remove them so they can re-register
    if (exist && !exist.isEmailVerified) {
      await User.deleteOne({ _id: exist._id });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // Create user (unverified)
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationOTP: hashedOTP,
      emailVerificationExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes

    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, fullName.trim());
      console.log("✅ OTP email sent to:", email);
    } catch (emailError) {
      console.error("❌ Failed to send OTP email:", emailError.message);
      // Still allow registration, user can request resend
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the verification code.",
      requiresVerification: true,
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ==========================================
// VERIFY OTP - Step 2: Verify Email
// ==========================================
export const VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+emailVerificationOTP +emailVerificationExpiry");

    if (!user) {
      return res.status(400).json({ message: "No registration found for this email" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Check OTP expiry
    if (!user.emailVerificationExpiry || user.emailVerificationExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Verify OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOTP !== user.emailVerificationOTP) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send welcome + thank you emails (fire and forget)
    Promise.all([
      sendWelcomeEmail(user.email, user.fullName).catch((e) =>
        console.error("Welcome email failed:", e.message)
      ),
      sendThankYouEmail(user.email, user.fullName).catch((e) =>
        console.error("Thank you email failed:", e.message)
      ),
    ]);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to LearningCamp.",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        points: user.points,
        badges: user.badges,
        enrolledCourses: user.enrolledCourses,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("VerifyOTP error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// ==========================================
// RESEND OTP
// ==========================================
export const ResendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+emailVerificationExpiry");

    if (!user) {
      return res.status(400).json({ message: "No registration found for this email" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.emailVerificationOTP = hashedOTP;
    user.emailVerificationExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp, user.fullName);

    res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("ResendOTP error:", error);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: user.email,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }



    const token = jwt.sign(
      { userId: user._id },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send login notification email (fire and forget)
    sendLoginNotificationEmail(user.email, user.fullName).catch((e) =>
      console.error("Login notification email failed:", e.message)
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
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal whether email exists
      return res.status(200).json({
        success: true,
        message: "If an account exists with this email, a reset code has been sent.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.forgotPasswordToken = hashedOTP;
    user.forgotPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp, user.fullName);

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, a reset code has been sent.",
    });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const ResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("+forgotPasswordToken +forgotPasswordExpiry");

    if (!user) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (!user.forgotPasswordExpiry || user.forgotPasswordExpiry < Date.now()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedOTP !== user.forgotPasswordToken) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// EDIT PROFILE
// ==========================================
export const EditProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (email) updateData.email = email.toLowerCase();
    if (req.file) updateData.profileImage = req.file.path;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("EditProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// ENROLL COURSE
// ==========================================
export const EnrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.enrolledCourses.some((id) => id.toString() === courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    // Also add student to the Course model
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: user._id }
    });

    const populatedUser = await User.findById(user._id).populate("enrolledCourses");

    res.status(200).json({
      success: true,
      message: "Enrolled successfully",
      user: {
        _id: populatedUser._id,
        fullName: populatedUser.fullName,
        email: populatedUser.email,
        enrolledCourses: populatedUser.enrolledCourses,
      },
    });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// GET USER DETAILS
// ==========================================
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

// ==========================================
// UPDATE POINTS
// ==========================================
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
