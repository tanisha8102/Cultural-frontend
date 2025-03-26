import React, { useState, useEffect } from "react";
import { FiX, FiCalendar, FiMapPin, FiLink, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import config from "../../config";
import "../styles/EventModal.css";

const EditEventModal = ({ eventData, onClose, onEventUpdated }) => {
    const API_BASE_URL = config.API_BASE_URL;
    const [event, setEvent] = useState({
        name: "",
        description: "",
        dateTime: "",
        location: "",
        meetLink: "",
    });

    useEffect(() => {
        if (eventData) {
            setEvent(eventData);
        }
    }, [eventData]);

    const handleChange = (key, value) => setEvent((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async () => {
        if (!event.name || !event.dateTime || !event.location) {
            toast.warning("Event name, date/time, and location are required!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Authorization token missing. Please log in again.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/events/${event._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(event),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong.");
            }

            toast.success("Event updated successfully!");
            onEventUpdated(result);
            onClose();
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Server error. Please try again.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <input
                        type="text"
                        placeholder="Event Name"
                        value={event.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <FiX className="close-icon" onClick={onClose} />
                </div>

                <div className="modal-options">
                    <div className="option-row">
                        <FiFileText />
                        <label>Description</label>
                        <textarea
                            rows="3"
                            placeholder="Write details..."
                            value={event.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                        />
                    </div>

                    <div className="option-row">
                        <FiCalendar />
                        <label>Date & Time</label>
                        <input
                            type="datetime-local"
                            value={event.dateTime}
                            onChange={(e) => handleChange("dateTime", e.target.value)}
                        />
                    </div>

                    <div className="option-row">
                        <FiMapPin />
                        <label>Location</label>
                        <input
                            type="text"
                            placeholder="Enter location"
                            value={event.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                        />
                    </div>

                    <div className="option-row">
                        <FiLink />
                        <label>Event Link</label>
                        <input
                            type="text"
                            placeholder="Enter meet link (optional)"
                            value={event.meetLink}
                            onChange={(e) => handleChange("meetLink", e.target.value)}
                        />
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="create-task-btn" onClick={handleSubmit}>Update Event</button>
                </div>
            </div>
        </div>
    );
};

export default EditEventModal;
