import React, { useState, useEffect } from "react";
import { FiX, FiClock, FiFlag, FiUserPlus, FiCheckCircle, FiTag } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import config from "../../config";

const options = [
  { key: "day", label: "Day", icon: FiClock, values: ["Today", "Tomorrow"], type: "button-date" },
  { key: "priority", label: "Priority", icon: FiFlag, values: ["Low", "Medium", "High"], type: "button" },
  { key: "assignees", label: "Assign", icon: FiUserPlus, type: "tag" },
  { key: "status", label: "Status", icon: FiCheckCircle, values: ["To-Do", "In Progress", "Completed"], type: "select" },
  { key: "category", label: "Category", icon: FiTag, type: "dropdown" }
];

const EditTaskModal = ({ onClose, task, onUpdate }) => {
  const API_BASE_URL = config.API_BASE_URL;
  const [taskState, setTaskState] = useState({
    name: "",
    day: "",
    priority: "",
    assignees: [],
    description: "",
    status: "To-Do",
    category: "",
  });

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users`)
      .then((res) => res.json())
      .then((data) => setRegisteredUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories/all`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected response format for categories:", data);
          setCategories([]); // Default to an empty array
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setCategories([]); // Ensure it's still an array
      });
  }, []);

  useEffect(() => {
    if (task) {
      setTaskState({
        name: task.name || "",
        day: task.day || "",
        priority: task.priority || "",
        assignees: task.assignees ? task.assignees.map(a => a._id) : [],
        description: task.description || "",
        status: task.status || "To-Do",
        category: task.category || "",
      });
    }
  }, [task]);

  const handleChange = (key, value) => {
    setTaskState((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddAssignee = (userId) => {
    if (!taskState.assignees.includes(userId)) {
      setTaskState((prev) => ({ ...prev, assignees: [...prev.assignees, userId] }));
    }
  };

  const handleRemoveAssignee = (userId) => {
    setTaskState((prev) => ({ ...prev, assignees: prev.assignees.filter(id => id !== userId) }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <input 
            type="text" 
            placeholder="Name of task" 
            value={taskState.name} 
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
                      className={taskState[key] === value ? "active" : ""}
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
                        className={taskState[key] === value ? "active" : ""}
                        onClick={() => handleChange(key, value)}
                      >
                        {value}
                      </button>
                    ))}
                    <input type="date" onChange={(e) => handleChange(key, e.target.value)} />
                  </>
                )}
                {type === "tag" ? (
                  <div className="assignee-list">
                    {taskState.assignees.map((assigneeId) => {
                      const user = registeredUsers.find((u) => u._id === assigneeId);
                      return user ? (
                        <div key={assigneeId} className="assignee-tag">
                          {user.name} <MdCancel className="remove-assignee" onClick={() => handleRemoveAssignee(assigneeId)} />
                        </div>
                      ) : null;
                    })}
                    <select onChange={(e) => handleAddAssignee(e.target.value)}>
                      <option value="">Select User</option>
                      {registeredUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : type === "select" ? (
                  <select value={taskState[key]} onChange={(e) => handleChange(key, e.target.value)}>
                    {values.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                ) : type === "dropdown" ? (
                  <select value={taskState.category} onChange={(e) => handleChange("category", e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="description-box">
          <label>Description</label>
          <textarea
            rows="3"
            placeholder="Write details..."
            value={taskState.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button 
            className="update-task-btn" 
            onClick={async () => {
              if (!taskState.name || !taskState.day || !taskState.priority || taskState.assignees.length === 0 || !taskState.status || !taskState.category) {
                toast.warning("Please fill all fields!");
                return;
              }

              try {
                const response = await fetch(`${API_BASE_URL}/api/tasks/update/${task._id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(taskState),
                });

                const result = await response.json();
                if (response.ok) {
                  toast.success("Task updated successfully!");
                  onUpdate(result);
                  onClose();
                } else {
                  toast.error(result.message || "Something went wrong.");
                }
              } catch (error) {
                console.error("Error:", error);
                toast.error("Server error. Please try again.");
              }
            }}
          >
            Update Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
