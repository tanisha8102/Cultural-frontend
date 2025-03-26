import React, { useState, useEffect } from "react";
import { FiX, FiClock, FiFlag, FiUserPlus, FiCheckCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import "../styles/TaskModal.css";
import { toast } from "react-toastify";
import config from "../../config";

const options = [
  { key: "day", label: "Day", icon: FiClock, values: ["Today", "Tomorrow"], type: "button-date" },
  { key: "priority", label: "Priority", icon: FiFlag, values: ["Low", "Medium", "High"], type: "button" },
  { key: "assignee", label: "Assign", icon: FiUserPlus, type: "select" },
  { key: "status", label: "Status", icon: FiCheckCircle, values: ["To-do", "In Progress", "Completed"], type: "select" }
];

const TaskModal = ({ onClose,onTaskAdded, registeredUsers = [] }) => {
  const API_BASE_URL = config.API_BASE_URL;
  const [task, setTask] = useState({
    name: "",
    day: "",
    priority: "",
    assignees: [],
    description: "",
    status: "To-do",
    category: "",
  });

  const [categories, setCategories] = useState([]); // Store fetched categories

  // Fetch categories when the modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories/all`);
        const result = await response.json();
        if (response.ok) {
          setCategories(result); // Assuming result is an array of categories
        } else {
          toast.error("Failed to load categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Server error while loading categories.");
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  const handleChange = (key, value) => setTask((prev) => ({ ...prev, [key]: value }));

  const handleAddAssignee = (e) => {
    const selectedUserId = e.target.value;
    if (selectedUserId && !task.assignees.includes(selectedUserId)) {
      setTask((prev) => ({ ...prev, assignees: [...prev.assignees, selectedUserId] }));
    }
  };

  const handleRemoveAssignee = (userId) => {
    setTask((prev) => ({ ...prev, assignees: prev.assignees.filter((id) => id !== userId) }));
  };

  const handleSubmit = async () => {
    if (!task.name) {
      toast.warning("Task name is required!");
      return;
    }

    const creatorId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!creatorId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, creator: creatorId }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Task created successfully!");
        onTaskAdded(result);  // Immediately update task list
        onClose();  // Close modal
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server error. Please try again.");
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <input
            type="text"
            placeholder="Name of task"
            value={task.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <FiX className="close-icon" onClick={onClose} />
        </div>

        <div className="modal-options">
          {options.map(({ key, label, icon: Icon, values, type }) => (
            <div className="option-row" key={key}>
              <Icon />
              <label>{label}</label>
              <div className="option-buttons">
                {type === "button" &&
                  values.map((value) => (
                    <button
                      key={value}
                      className={task[key] === value ? "active" : ""}
                      onClick={() => handleChange(key, value)}
                    >
                      {value}
                    </button>
                  ))}
                {type === "button-date" && (
                  <>
                    {values.map((value) => (
                      <button
                        key={value}
                        className={task[key] === value ? "active" : ""}
                        onClick={() => handleChange(key, value)}
                      >
                        {value}
                      </button>
                    ))}
                    <input type="date" onChange={(e) => handleChange(key, e.target.value)} />
                  </>
                )}
                {key === "assignee" && (
                  <>
                    <select onChange={handleAddAssignee}>
                      <option value="">Select User</option>
                      {registeredUsers.map((user) => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                    <div className="assignee-list">
                      {task.assignees.map((userId) => {
                        const user = registeredUsers.find(u => u._id === userId);
                        return user ? (
                          <div key={user._id} className="assignee-tag">
                            {user.name} <MdCancel className="remove-assignee" onClick={() => handleRemoveAssignee(user._id)} />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </>
                )}
                {key === "status" && (
                  <select value={task.status} onChange={(e) => handleChange("status", e.target.value)}>
                    {values.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}

          {/* Category Dropdown */}
          <div className="option-row">
            <label>Category</label>
            <select value={task.category} onChange={(e) => handleChange("category", e.target.value)}>
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="description-box">
          <label>Description</label>
          <textarea
            rows="3"
            placeholder="Write details..."
            value={task.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="create-task-btn" onClick={handleSubmit}>Create task</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
