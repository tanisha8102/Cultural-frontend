import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import "../styles/AnnouncementModal.css";
import { toast } from "react-toastify";
import config from "../../config";

const AnnouncementModal = ({ onClose, onAnnouncementAdded }) => {
  const API_BASE_URL = config.API_BASE_URL;
  const [announcement, setAnnouncement] = useState({
    name: "", // Changed from title to name
    description: "",
    dateTime: new Date().toISOString().slice(0, 16),
    isActive: true,
  });

  const handleChange = (key, value) =>
    setAnnouncement((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!announcement.name) {
      toast.warning("Title is required!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Announcement created successfully!");
        onAnnouncementAdded(result);
        onClose();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="announcement-modal-overlay">
      <div className="announcement-modal-content">
        <div className="announcement-modal-header">
          <input
            type="text"
            placeholder="Title of Announcement"
            value={announcement.name} // Updated from title to name
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <FiX className="announcement-close-icon" onClick={onClose} />
        </div>

        <div className="announcement-description-box">
          <label>Description</label>
          <textarea
            rows="3"
            placeholder="Write details..."
            value={announcement.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="announcement-date-box">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={announcement.dateTime}
            onChange={(e) => handleChange("dateTime", e.target.value)}
          />
        </div>

        <div className="announcement-status-box">
          <label>Status</label>
          <div className="toggle-container">
            <label className="switch">
              <input
                type="checkbox"
                checked={announcement.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="announcement-modal-footer">
          <button className="create-announcement-btn" onClick={handleSubmit}>
            Create Announcement
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;