import express from "express";
import {
    Register,
    VerifyOTP,
    ResendOTP,
    Login,
    ForgotPassword,
    ResetPassword,
    EditProfile,
    EnrollCourse,
    GetUserDetails,
    UpdatePoints,
} from "../Controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Auth routes
router.post("/register", Register);
router.post("/verify-otp", VerifyOTP);
router.post("/resend-otp", ResendOTP);
router.post("/login", Login);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password", ResetPassword);

// Protected routes
router.put("/profile", protectRoute, upload.single("profileImage"), EditProfile);
router.post("/enroll", protectRoute, EnrollCourse);
router.get("/me", protectRoute, GetUserDetails);
router.post("/points", protectRoute, UpdatePoints);

export default router;
