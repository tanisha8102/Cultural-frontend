import React, { useEffect, useState } from "react";
import "../styles/TaskDetailsPopup.css";
import { IoClose } from "react-icons/io5";
import { FaFlag, FaUser, FaCalendarAlt, FaTasks, FaTag } from "react-icons/fa";

const TaskDetailsPopup = ({ task, onClose }) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (task.category) {
      fetchCategoryName(task.category);
    }
  }, [task.category]);

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      const data = await response.json();
      if (response.ok) {
        setCategoryName(data.name);
      } else {
        setCategoryName("-");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setCategoryName("-");
    }
  };

  if (!task) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>{task.name}</h2>
          <IoClose className="close-icon" onClick={onClose} />
        </div>

        <div className="popup-content">
          <div className="popup-row">
            <FaTasks className="popup-icon" />
            <span className="popup-label">Status:</span>
            <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span>
          </div>

          <div className="popup-row">
            <FaFlag className="popup-icon" />
            <span className="popup-label">Priority:</span>
            <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
          </div>

          <div className="popup-row">
            <FaUser className="popup-icon" />
            <span className="popup-label">Assignees:</span>
            <div className="assignee-list">
              {task.assignees && task.assignees.length > 0 ? (
                task.assignees.map((assignee) => (
                  <span key={assignee._id} className="assignee-tag">{assignee.name}</span>
                ))
              ) : (
                <span>Unassigned</span>
              )}
            </div>
          </div>

          <div className="popup-row">
            <FaCalendarAlt className="popup-icon" />
            <span className="popup-label">Due Date:</span>
            <span>{task.day}</span>
          </div>

          <div className="popup-row">
            <FaTag className="popup-icon" />
            <span className="popup-label">Category:</span>
            <span>{categoryName || "No category assigned"}</span>
          </div>

          <div className="popup-row">
            <span className="popup-label">Description:</span>
            <p className="popup-description">{task.description || "No description provided."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPopup;
