import "../Styles/Contact.css";
import Footer from "../components/Footer";

export const About = () => {
  return (
    <>
      <div className="provider">
        <div className="provider-details">
          <h2>About LearningCamp</h2>
          <p>
            LearningCamp is a leading online learning platform providing
            industry-focused courses in Web Development, Data Science,
            UI/UX Design, and more. We empower thousands of learners
            to achieve their career goals with expert instruction
            and certified programs.
          </p>

          <div className="details">
            <p><strong>Company Name:</strong> LearningCamp EdTech Pvt Ltd</p>
            <p><strong>Email:</strong> support@LearningCamp.com</p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Address:</strong> Hyderabad, Telangana, India</p>
            <p><strong>Working Hours:</strong> Mon - Sat (9:00 AM - 6:00 PM)</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};