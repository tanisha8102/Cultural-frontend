import React, { useEffect, useState } from "react";
import "../styles/TaskList.css";
import config from "../../config";

const TaskList = ({ searchQuery }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = config.API_BASE_URL;

  const fetchTasks = async () => {
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        const formattedTasks = data.map((task) => ({
          id: task._id,
          text: task.name,
          description: task.description || "", // Ensure description exists
          due: task.day,
          priority: task.priority || "Low", // Default to Low if missing
          done: task.status === "Completed",
          createdAt: task.createdAt,
        }));

        formattedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTasks(formattedTasks);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);

    const targetTask = updatedTasks.find((task) => task.id === id);
    const newStatus = targetTask.done ? "Completed" : "To-Do";

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/update-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery?.toLowerCase() || ""; // Ensure searchQuery is not undefined
    return (
      task.text.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  });

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  

  return (
    <div className="tasklist-container">
      <div className="tasklist-header">
        <h3>My tasks ({filteredTasks.length})</h3>
        <span className="menu-icon">⋮</span>
      </div>

      <div className="tasklist-table">
        <div className="tasklist-headers">
          <span className="task-header">Task</span>
          <span className="task-due-header">Date</span>
          <span className="task-priority-header">Priority</span>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <ul className="tasklist">
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <span
                  className={`circle ${task.done ? "done" : ""}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done && "✔"}
                </span>
                <span className={`task-text ${task.done ? "strike" : ""}`}>
                {capitalizeWords(task.text)}
                </span>
              </div>
              <span className="task-due">{task.due}</span>
              <span className={`task-priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
        
        )}
      </div>
    </div>
  );
};

export default TaskList;
