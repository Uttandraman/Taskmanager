import React from "react";
import SettingsPage from "./SettingsPage";
import "./SettingsSidebar.css";

const SettingsSidebar = ({ open, onClose }) => {
  if (!open) return null; // Only render when open

  return (
    <div className="settings-sidebar-overlay open">
      <div className="settings-sidebar">
        <button className="sidebar-close-btn" onClick={onClose}>×</button>
        <SettingsPage />
      </div>
      <div className="settings-sidebar-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default SettingsSidebar;