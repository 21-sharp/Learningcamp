import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js"; // Ensure Cloudinary is configured

// Set up Multer Storage correctly
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "lms_profiles", // Store files in the "lms_profiles" folder on Cloudinary
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Only allow images
    },
});

const upload = multer({ storage });
export default upload;
