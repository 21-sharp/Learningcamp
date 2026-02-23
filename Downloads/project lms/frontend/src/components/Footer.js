import React from "react";
import "./Footer.css";

const Footer = () => {
  const footerData = [
    {
      title: "Support",
      links: ["FAQ", "Contact Us", "Help Center", "Community"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"]
    },
    {
      title: "Connect",
      links: ["Twitter", "LinkedIn", "Instagram", "YouTube"]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-brand">
          <div className="logo">
            <span className="icon">🎓</span>
            <h2>LearningCamp</h2>
          </div>
          <p>
            Empowering learners worldwide with industry-focused courses
            and certifications that accelerate your career.
          </p>
        </div>

        {/* Dynamic Columns */}
        {footerData.map((section, index) => (
          <div key={index} className="footer-column">
            <h3>{section.title}</h3>
            <ul>
              {section.links.map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LearningCamp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;