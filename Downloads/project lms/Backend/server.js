import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";

import examRoute from "./routes/exam.route.js";

const app = express();

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoute);
app.use("/api/courses", courseRoute);
app.use("/api/exams", examRoute);

connectDB().then(() => {
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on ${ENV.PORT}`);
  });
});
