import express from "express";
import { Register, Login, EditProfile, EnrollCourse, GetUserDetails, UpdatePoints } from "../Controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post("/register", upload.single("image"), Register);
router.post("/login", Login);
router.put("/profile", protectRoute, upload.single("profileImage"), EditProfile);
router.post("/enroll", protectRoute, EnrollCourse);
router.get("/me", protectRoute, GetUserDetails);
router.post("/points", protectRoute, UpdatePoints);

export default router;
