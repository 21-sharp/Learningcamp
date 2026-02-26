import { useState } from "react";
import API from "../services/api";
import "../Styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/misc/contact", formData);
      if (res.data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-form-section">
        <h2 className="text-3xl font-extrabold mb-2 text-center">Contact Us</h2>
        <p className="text-base-content/60 text-center mb-8">Reach out to our support team for any queries.</p>

        {submitted && (
          <div className="alert alert-success shadow-sm mb-6 rounded-xl border-none text-white font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Message sent successfully! Check your email for confirmation.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="input input-bordered w-full rounded-xl focus:input-primary"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="input input-bordered w-full rounded-xl focus:input-primary"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            className="textarea textarea-bordered w-full rounded-xl focus:textarea-primary h-32"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button
            type="submit"
            className={`btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;