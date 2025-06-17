import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import Logo from "../assets/LOGO.png";

const Body = () => {
  const checkboxesRef = useRef([]);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // loading state

  const options = [
    "Personal Info",
    "Address",
    "Delete All Data",
    "Delete All Account"
  ];

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleDeleteUserData = () => {
    const selected = checkboxesRef.current
      .filter((checkbox) => checkbox?.checked)
      .map((checkbox) => checkbox.dataset.label);

    if (selected.length === 0) {
      setMessage("⚠️ Please select at least one option.");
      setTimeout(() => setMessage(''), 3000);
    } else {
      setSelectedData(selected);
      setShowConfirm(true);
    }
  };

  const confirmDelete = () => {
    setShowEmailInput(true);
    setShowConfirm(false);
  };

  const sendEmail = () => {
    if (!email || !email.includes('@')) {
      setMessage("⚠️ Please enter a valid email.");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    const selectedItemsString = selectedData.join(', ');

    const templateParams = {
  selected_items: selectedItemsString, // dynamic
  name: "user",                             // optional name if you want it
  message: "Requesting deletion",           // optional message
  email: email,                // used for Reply To
};


    emailjs.send(
      "service_xqwong1",       // Replace with your service ID
      "template_9np6eyk",      // Replace with your template ID
      templateParams,
      "SZ_6c35Elc2R8s_ha"      // Replace with your public API key
    ).then(
      (response) => {
        console.log("Email sent!", response.status, response.text);
        setMessage(`✅ Deleted and emailed: ${selectedItemsString}`);
      },
      (error) => {
        console.error("Email failed:", error);
        setMessage("❌ Failed to send email.");
      }
    ).finally(() => {
      setLoading(false);
      checkboxesRef.current.forEach((checkbox) => {
        if (checkbox) checkbox.checked = false;
      });
      setShowEmailInput(false);
      setEmail('');
      setTimeout(() => setMessage(''), 5000);
    });
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setShowEmailInput(false);
    setMessage("❌ Deletion canceled.");
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <div className="top-bar">
        <div className='LogoImg'>
          <img src={Logo} alt="LOGO_IMG" />
        </div>
        <button className="dark-toggle" onClick={toggleDarkMode}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className='Box'>
        <h1>Request Data Delete</h1>

        {options.map((label, index) => (
          <div className="data-section" key={index}>
            <div className="checkbox-item">
              <input
                id={`checkbox-${index}`}
                type="checkbox"
                ref={(el) => (checkboxesRef.current[index] = el)}
                data-label={label}
              />
              <label htmlFor={`checkbox-${index}`}>{label}</label>
            </div>
          </div>
        ))}

        <div className="delete-btn" onClick={handleDeleteUserData}>
          Request Delete
        </div>

        {message && <div className="message-box">{message}</div>}

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <p>Are you sure you want to delete: <strong>{selectedData.join(', ')}</strong>?</p>
              <div className="btn-group">
                <button className="yes-btn" onClick={confirmDelete}>Yes</button>
                <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showEmailInput && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <p>Enter your email to confirm deletion:</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="email-input"
              />
              <div className="btn-group">
                <button className="yes-btn" onClick={sendEmail} disabled={loading}>
                  {loading ? "Sending..." : "Submit"}
                </button>
                <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
