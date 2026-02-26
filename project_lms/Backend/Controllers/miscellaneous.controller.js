import { sendContactEmail } from "../utils/sendEmail.js";

export const ContactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await sendContactEmail(name, email, message);

        res.status(200).json({
            success: true,
            message: "Thank you for contacting us! We've received your message and sent a confirmation to your email."
        });
    } catch (error) {
        console.error("ContactUs error:", error);
        res.status(500).json({ message: "Failed to send message. Please try again later." });
    }
};
