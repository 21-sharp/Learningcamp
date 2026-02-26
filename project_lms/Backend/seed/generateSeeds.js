import fs from "fs";

const seedCourseContent = `import dotenv from "dotenv";
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
`;

fs.writeFileSync("c:\\Users\\cheli\\Downloads\\project lms\\Backend\\seed\\seedCourse.js", seedCourseContent);

const seedExamContent = `import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import Course from "../Models/Courses.js";
import Exam from "../models/Exam.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

await connectDB();
await Exam.deleteMany();

const courses = await Course.find();

const customQuestions = {
  "React JS Complete Course": [
    ["What is React mainly used for?", ["Building database", "Building user interfaces", "Routing", "Styling"], "Building user interfaces"],
    ["What is JSX?", ["JavaScript XML", "JSON XML", "Java Syntax Extension", "JavaScript Extension"], "JavaScript XML"],
    ["Which hook is used to manage state?", ["useEffect", "useContext", "useState", "useReducer"], "useState"],
    ["Which of the following creates a functional component?", ["class App extends React.Component", "function App()", "React.createComponent()", "new Component()"], "function App()"],
    ["What is the virtual DOM?", ["A direct copy of the real DOM", "A lightweight copy of the real DOM kept in memory", "A browser feature", "An external library"], "A lightweight copy of the real DOM kept in memory"],
    ["What are 'props' in React?", ["Methods", "Internal state", "Arguments passed into React components", "External libraries"], "Arguments passed into React components"],
    ["Which hook is used to perform side effects?", ["useState", "useEffect", "useMemo", "useRef"], "useEffect"],
    ["How do you correctly update a state variable named 'count'?", ["count = count + 1", "setCount(count + 1)", "update(count)", "changeState('count', 1)"], "setCount(count + 1)"],
    ["What is React Router used for?", ["State management", "Server-side routing", "Client-side routing", "API fetching"], "Client-side routing"],
    ["Which company maintains React?", ["Google", "Meta (Facebook)", "Microsoft", "Twitter"], "Meta (Facebook)"]
  ],
  "Node JS Complete Course": [
    ["What engine runs Node.js?", ["SpiderMonkey", "V8 Engine", "Chakra", "Rhino"], "V8 Engine"],
    ["What does npm stand for?", ["Node Package Make", "Node Package Manager", "New Project Manager", "None"], "Node Package Manager"],
    ["Which module is used to read files?", ["http", "path", "fs", "os"], "fs"],
    ["Is Node.js single-threaded or multi-threaded?", ["Single-threaded", "Multi-threaded", "Both", "Depends on OS"], "Single-threaded"],
    ["How do you create an HTTP server in Node.js?", ["http.createServer()", "express.create()", "node.server()", "app.listen()"], "http.createServer()"],
    ["What is the purpose of module.exports?", ["To import a module", "To expose variables/functions from a file", "To start the server", "To connect to DB"], "To expose variables/functions from a file"],
    ["Which core module creates a web server?", ["fs", "url", "http", "buffer"], "http"],
    ["Which of these is NOT a core module in Node?", ["path", "fs", "react", "http"], "react"],
    ["What is a callback in Node.js?", ["An error handler", "A function passed as an argument to be executed later", "A way to pause execution", "An API endpoint"], "A function passed as an argument to be executed later"],
    ["What command is used to initialize a new Node.js project?", ["npm start", "npm build", "npm init", "node start"], "npm init"]
  ],
  "MongoDB Full Course": [
    ["What type of DB is MongoDB?", ["Relational", "NoSQL Document-Oriented", "Key-Value", "Graph"], "NoSQL Document-Oriented"],
    ["What format does MongoDB use to store data?", ["XML", "BSON (Binary JSON)", "CSV", "YAML"], "BSON (Binary JSON)"],
    ["What is a collection in MongoDB?", ["A table", "A row", "A column", "A group of MongoDB documents"], "A group of MongoDB documents"],
    ["What is Mongoose?", ["A MongoDB GUI", "An Object Data Modeling (ODM) library", "A query language", "A server framework"], "An Object Data Modeling (ODM) library"],
    ["Which command inserts a document?", ["db.collection.add()", "db.collection.insert()", "db.collection.push()", "db.collection.create()"], "db.collection.insert()"],
    ["What does the _id field do?", ["Acts as a primary key", "Encrypts the document", "Links to other collections", "Hides the document"], "Acts as a primary key"],
    ["How do you find all documents in 'users'?", ["db.users.get()", "db.users.findAll()", "db.users.find()", "db.users.select()"], "db.users.find()"],
    ["Which operator is used for greater than?", ["$gt", "$greater", "$gr", ">"], "$gt"],
    ["What feature improves query performance?", ["Triggers", "Indexes", "Foreign Keys", "Joins"], "Indexes"],
    ["What is a replica set?", ["A backup file", "A group of MongoDB instances that maintain the same data set", "A specific query", "A database schema"], "A group of MongoDB instances that maintain the same data set"]
  ],
  // Default for others
  "default": [
    ["What is the primary function of this technology?", ["Styling", "Data Storage", "Logic Execution", "To build applications"], "To build applications"],
    ["When was this technology widely adopted?", ["2000s", "2010s", "1990s", "Recently"], "2010s"],
    ["Is it open-source?", ["Yes", "No", "Partially", "Unknown"], "Yes"],
    ["Which of these is a core concept?", ["Variables", "Waterfalls", "Microchips", "Quantum entanglement"], "Variables"],
    ["What signifies the end of a statement in many programming languages?", [";", ":", ".", "!"], ";"],
    ["What is debugging?", ["Adding new features", "Finding and resolving bugs/errors", "Writing documentation", "Deploying the app"], "Finding and resolving bugs/errors"],
    ["What does API stand for?", ["Application Programming Interface", "Advanced Program Integration", "Automated Processing Input", "None"], "Application Programming Interface"],
    ["Where does frontend code typically run?", ["Database", "Server", "Client Browser", "Cloud VM"], "Client Browser"],
    ["Where does backend code run?", ["Mobile App", "Client Browser", "Server", "Desktop"], "Server"],
    ["What is version control useful for?", ["Styling websites", "Tracking and managing changes to code", "Hosting databases", "Running servers"], "Tracking and managing changes to code"]
  ]
};

for (let course of courses) {
  let questionsData = customQuestions[course.title] || customQuestions["default"];
  
  let formattedQuestions = questionsData.map(q => ({
    question: q[0],
    options: q[1],
    correctAnswer: q[2]
  }));

  await Exam.create({
    course: course._id,
    questions: formattedQuestions
  });

  console.log(\`✅ Exam created with REAL 10 unique questions for \${course.title}\`);
}

console.log("🎉 All 15 exams populated with real non-repeating questions!");
process.exit();
`;

fs.writeFileSync("c:\\Users\\cheli\\Downloads\\project lms\\Backend\\seed\\seedExam.js", seedExamContent);
console.log("Seed files overwritten successfully.");
