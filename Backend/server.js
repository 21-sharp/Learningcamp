import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import examRoute from "./routes/exam.route.js";
import miscRoute from "./routes/miscellaneous.route.js";

const app = express();

app.use(cors({ origin: [ENV.CLIENT_URL], credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute);
app.use("/api/courses", courseRoute);
app.use("/api/exams", examRoute);
app.use("/api/misc", miscRoute);

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "API is running!" });
});

// Root-level database connection logic
if (process.env.NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
        app.listen(ENV.PORT, () => {
          console.log(`🚀 Server running on ${ENV.PORT}`);
        });
      }
    })
    .catch((err) => {
      console.error("MongoDB Connection Failed: ", err);
    });
}

export default app;
