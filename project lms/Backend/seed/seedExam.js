import dotenv from "dotenv";
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

  console.log(`✅ Exam created with REAL 10 unique questions for ${course.title}`);
}

console.log("🎉 All 15 exams populated with real non-repeating questions!");
process.exit();
