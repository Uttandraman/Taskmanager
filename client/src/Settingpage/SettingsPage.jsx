import React, { useState } from "react";
import { FaUser, FaPalette, FaBell, FaGlobe, FaDatabase } from "react-icons/fa";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>

      {/* Profile Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <FaUser className="settings-section-icon" />
          <div>
            <h3>Profile</h3>
            <p className="settings-section-desc">Update your personal information.</p>
          </div>
        </div>
        <label className="settings-label">
          Name
          <input type="text" placeholder="Your Name" />
        </label>
        <label className="settings-label">
          Email
          <input type="email" placeholder="you@email.com" />
        </label>
        <button className="settings-button" style={{ marginTop: 8 }}>Update Profile</button>
      </section>

      {/* Theme Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <FaPalette className="settings-section-icon" />
          <div>
            <h3>Appearance</h3>
            <p className="settings-section-desc">Choose your preferred theme.</p>
          </div>
        </div>
        <label className="settings-label">
          Theme
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </section>

      {/* Notifications Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <FaBell className="settings-section-icon" />
          <div>
            <h3>Notifications</h3>
            <p className="settings-section-desc">Manage your notification preferences.</p>
          </div>
        </div>
        <label className="settings-checkbox-label">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={e => setEmailNotifications(e.target.checked)}
          />
          Email notifications
        </label>
      </section>

      {/* Language Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <FaGlobe className="settings-section-icon" />
          <div>
            <h3>Language</h3>
            <p className="settings-section-desc">Select your language.</p>
          </div>
        </div>
        <label className="settings-label">
          Language
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </label>
      </section>

      {/* Export/Import Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <FaDatabase className="settings-section-icon" />
          <div>
            <h3>Data</h3>
            <p className="settings-section-desc">Export or import your tasks.</p>
          </div>
        </div>
        <div className="settings-buttons">
          <button className="settings-button">Export Tasks</button>
          <button className="settings-button">Import Tasks</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;