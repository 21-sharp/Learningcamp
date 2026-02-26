import { connectDB } from "./config/db.js";
import Course from "./Models/Courses.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function checkCourses() {
    await connectDB();
    const courses = await Course.find({}, 'title sections');
    console.log("Current Courses:", JSON.stringify(courses, null, 2));
    process.exit(0);
}

checkCourses();
