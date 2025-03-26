import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/FeedbackForm.css";
import config from "../../config";

const API_BASE_URL = config.API_BASE_URL;

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/feedback/submit`, formData);
      console.log("Feedback Submitted", response.data);
      toast.success("Feedback submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting feedback", error);
      toast.error("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Feedback Form</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            placeholder="Enter subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <label>Message:</label>
          <textarea
            name="message"
            placeholder="Enter message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="submit-btn">Submit →</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
