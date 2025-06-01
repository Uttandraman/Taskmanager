import React, { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [taskReminder, setTaskReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [defaultCategoryColor, setDefaultCategoryColor] = useState("#4CAF50");
  const [username, setUsername] = useState("User123");

  const handleExportTasks = () => {
    alert("Tasks exported as JSON!");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirmDelete) {
      alert("Account deleted.");
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-heading">Settings</h2>

      {/* Profile Settings */}
      <div className="card">
        <h3>Profile</h3>
        <div className="field-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="button button-secondary">Change Password</button>
      </div>

      {/* Theme Settings */}
      <div className="card">
        <h3>Theme</h3>
        <div className="switch-row">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="categoryColor">Default Category Color</label>
          <input
            id="categoryColor"
            type="color"
            value={defaultCategoryColor}
            onChange={(e) => setDefaultCategoryColor(e.target.value)}
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <h3>Notifications</h3>
        <div className="switch-row">
          <span>Task Reminders</span>
          <input
            type="checkbox"
            checked={taskReminder}
            onChange={() => setTaskReminder(!taskReminder)}
          />
        </div>
        <div className="field-group">
          <label htmlFor="reminderTime">Reminder Time</label>
          <input
            id="reminderTime"
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <h3>Data & Account</h3>
        <button className="button" onClick={handleExportTasks}>
          Export Tasks as JSON
        </button>
        <button className="button button-destructive" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
