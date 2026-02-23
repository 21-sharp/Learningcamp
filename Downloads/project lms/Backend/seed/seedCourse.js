import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { connectDB } from "../config/db.js";
import Course from "../Models/Courses.js";

await connectDB();
await Course.deleteMany();

const generateSections = (title, videoId) => {
  return [
    {
      title: "Module 1: Getting Started",
      lessons: [
        { title: "Introduction to " + title, videoUrl: "https://www.youtube.com/embed/" + videoId, duration: "10:00", description: "Welcome to the course." },
        { title: "Environment Setup", videoUrl: "https://www.youtube.com/embed/" + videoId + "?start=600", duration: "15:30", description: "Setting up your development tools." }
      ]
    },
    {
      title: "Module 2: Core Concepts",
      lessons: [
        { title: "Fundamentals Part 1", videoUrl: "https://www.youtube.com/embed/" + videoId + "?start=1500", duration: "25:00", description: "Diving into the core concepts." },
        { title: "Fundamentals Part 2", videoUrl: "https://www.youtube.com/embed/" + videoId + "?start=3000", duration: "20:45", description: "Continuing with fundamental topics." }
      ]
    },
    {
      title: "Module 3: Advanced Topics",
      lessons: [
        { title: "Building a Project", videoUrl: "https://www.youtube.com/embed/" + videoId + "?start=4500", duration: "40:00", description: "Applying what we learned." },
        { title: "Deployment and Best Practices", videoUrl: "https://www.youtube.com/embed/" + videoId + "?start=6900", duration: "35:00", description: "Wrapping up the course." }
      ]
    }
  ];
};

const coursesData = [
  {
    title: "React JS Complete Course",
    description: "Learn React from scratch",
    duration: "11 Hours",
    category: "Frontend",
    instructor: "Hitesh Choudhary",
    level: "Beginner",
    image: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
    sections: generateSections("React JS", "bMknfKXIFA8")
  },
  {
    title: "Node JS Complete Course",
    description: "Backend development with Node",
    duration: "10 Hours",
    category: "Backend",
    instructor: "Traversy Media",
    level: "Intermediate",
    image: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4",
    sections: generateSections("Node JS", "fBNz5xF-Kx4")
  },
  {
    title: "MongoDB Full Course",
    description: "Complete MongoDB and Mongoose guide",
    duration: "8 Hours",
    category: "Database",
    instructor: "Net Ninja",
    level: "Intermediate",
    image: "https://img.youtube.com/vi/-56x56UppqQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/-56x56UppqQ",
    sections: generateSections("MongoDB", "-56x56UppqQ")
  },
  {
    title: "JavaScript Mastery",
    description: "Modern JavaScript from beginner to advanced",
    duration: "12 Hours",
    category: "Frontend",
    instructor: "freeCodeCamp",
    level: "Beginner",
    image: "https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg",
    sections: generateSections("JavaScript", "PkZNo7MFNFg")
  },
  {
    title: "HTML & CSS Crash Course",
    description: "Build responsive websites",
    duration: "6 Hours",
    category: "Frontend",
    instructor: "Traversy Media",
    level: "Beginner",
    image: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
    sections: generateSections("HTML & CSS", "UB1O30fR-EE")
  },
  {
    title: "Express JS Tutorial",
    description: "Build REST APIs with Express",
    duration: "7 Hours",
    category: "Backend",
    instructor: "Traversy Media",
    level: "Intermediate",
    image: "https://img.youtube.com/vi/L72fhGm1tfE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/L72fhGm1tfE",
    sections: generateSections("Express JS", "L72fhGm1tfE")
  },
  {
    title: "TypeScript Complete Guide",
    description: "Strong typing for JavaScript",
    duration: "9 Hours",
    category: "Frontend",
    instructor: "Academind",
    level: "Intermediate",
    image: "https://img.youtube.com/vi/BwuLxPH8IDs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs",
    sections: generateSections("TypeScript", "BwuLxPH8IDs")
  },
  {
    title: "Next JS Full Course",
    description: "Build production ready React apps",
    duration: "10 Hours",
    category: "Frontend",
    instructor: "JavaScript Mastery",
    level: "Advanced",
    image: "https://img.youtube.com/vi/Sklc_fQBmcs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Sklc_fQBmcs",
    sections: generateSections("Next JS", "Sklc_fQBmcs")
  },
  {
    title: "Redux Toolkit Tutorial",
    description: "State management made easy",
    duration: "5 Hours",
    category: "Frontend",
    instructor: "Dave Gray",
    level: "Intermediate",
    image: "https://img.youtube.com/vi/9zySeP5vH9c/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/9zySeP5vH9c",
    sections: generateSections("Redux Toolkit", "9zySeP5vH9c")
  },
  {
    title: "Python Full Course",
    description: "Python programming for beginners",
    duration: "14 Hours",
    category: "Programming",
    instructor: "freeCodeCamp",
    level: "Beginner",
    image: "https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
    sections: generateSections("Python", "_uQrJ0TkZlc")
  },
  {
    title: "Data Structures & Algorithms",
    description: "Master DSA for interviews",
    duration: "15 Hours",
    category: "Programming",
    instructor: "freeCodeCamp",
    level: "Advanced",
    image: "https://img.youtube.com/vi/8hly31xKli0/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/8hly31xKli0",
    sections: generateSections("DSA", "8hly31xKli0")
  },
  {
    title: "C++ Programming",
    description: "Complete C++ from basics",
    duration: "13 Hours",
    category: "Programming",
    instructor: "CodeWithHarry",
    level: "Beginner",
    image: "https://img.youtube.com/vi/vLnPwxZdW4Y/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
    sections: generateSections("C++", "vLnPwxZdW4Y")
  },
  {
    title: "Java Programming Masterclass",
    description: "Java for beginners to advanced",
    duration: "16 Hours",
    category: "Programming",
    instructor: "Telusko",
    level: "Beginner",
    image: "https://img.youtube.com/vi/grEKMHGYyns/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/grEKMHGYyns",
    sections: generateSections("Java", "grEKMHGYyns")
  },
  {
    title: "Git & GitHub Tutorial",
    description: "Version control system complete guide",
    duration: "4 Hours",
    category: "DevOps",
    instructor: "freeCodeCamp",
    level: "Beginner",
    image: "https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk",
    sections: generateSections("Git & GitHub", "RGOj5yH7evk")
  },
  {
    title: "Full MERN Stack Project",
    description: "Build complete MERN stack application",
    duration: "18 Hours",
    category: "Full Stack",
    instructor: "JavaScript Mastery",
    level: "Advanced",
    image: "https://img.youtube.com/vi/7CqJlxBYj-M/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
    sections: generateSections("MERN Stack", "7CqJlxBYj-M")
  }
];

await Course.insertMany(coursesData);
console.log("✅ Courses inserted with real sections and videos!");
process.exit();
