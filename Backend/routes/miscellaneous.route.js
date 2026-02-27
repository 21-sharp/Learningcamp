import express from "express";
import { ContactUs } from "../Controllers/miscellaneous.controller.js";

const router = express.Router();

router.post("/contact", ContactUs);

export default router;
