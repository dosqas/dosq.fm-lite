import React from 'react';
import "../../styles/contact.css";

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <h1>Contact</h1>
      <p>If you have any questions, feedback, or suggestions about dosq.fm, feel free to reach out!</p>
      <h2>How to Contact Me</h2>
      <ul>
        <li>📧 Email: <a href="mailto:sebastian.soptelea@proton.me">sebastian.soptelea@proton.me</a></li>
        <li>🔗 LinkedIn: <a href="https://linkedin.com/in/sebastian-soptelea/" target="_blank" rel="noopener noreferrer">linkedin.com/in/sebastian-soptelea</a></li>
        <li>📷 Instagram: <a href="https://instagram.com/dosqas" target="_blank" rel="noopener noreferrer">@dosqas</a></li>
        <li>📌 GitHub: <a href="https://github.com/dosqas" target="_blank" rel="noopener noreferrer">github.com/dosqas</a></li>
      </ul>
      <p>I'm always open to hearing your thoughts and improving dosq.fm. Whether it's a bug report, a feature request, or just a chat about music, don’t hesitate to get in touch!</p>
    </div>
  );
};

export default ContactPage;