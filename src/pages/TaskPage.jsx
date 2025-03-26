import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/TaskPage.css";
import DeleteModal from "../components/DeleteModal";
import EditTaskModal from "../components/EditTaskModal";
import TaskDetailsPopup from "../components/TaskDetailsPopup";
import { toast } from "react-toastify";
import TaskModal from "../components/TaskModal"; // Import TaskModal
import { FiPlus } from "react-icons/fi";


const TaskPage = () => {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const [categories, setCategories] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = config.API_BASE_URL;
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role"); // Get role from localStorage
    setUserRole(role);
  }, []);


  const fetchRegisteredUsers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/users`);
      setRegisteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  useEffect(() => {
    fetchRegisteredUsers();
  }, []);
  



  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (!token) {
      navigate("/");
    } else {
      setUserName(name || "");
      fetchTasks();
    }
  }, [navigate]);

  const fetchCategories = async (taskList) => {
    try {
      const categoryMap = { ...categories }; // Preserve existing categories
      const uniqueCategoryIds = new Set();
  
      // Collect unique category IDs from tasks
      taskList.forEach((task) => {
        if (task.category && !categoryMap[task.category]) {
          uniqueCategoryIds.add(task.category);
        }
      });
  
      // Fetch categories in parallel
      const categoryPromises = Array.from(uniqueCategoryIds).map(async (categoryId) => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/categories/${categoryId}`);
          return { id: categoryId, name: data.name };
        } catch (error) {
          // No console log
          return { id: categoryId, name: "-" }; // Fallback silently
        }
      });
  
      const categoriesFetched = await Promise.all(categoryPromises);
  
      // Map categories
      categoriesFetched.forEach(({ id, name }) => {
        categoryMap[id] = name;
      });
  
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  
  useEffect(() => {
    if (tasks.length > 0) {
      fetchCategories(tasks);
    }
  }, [tasks]);
  

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        navigate("/");
        return;
      }
  
      const res = await axios.get(`${API_BASE_URL}/api/tasks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setTasks(res.data);

      fetchCategories(res.data);
  
      // Fetch profile images for all unique user IDs
      const uniqueUserIds = new Set();
      res.data.forEach((task) => {
        task.assignees.forEach((assignee) => {
          if (!profileImages[assignee._id]) {
            uniqueUserIds.add(assignee._id);
          }
        });
      });
  
      // Fetch user profile images in parallel
      const userProfiles = await Promise.all(
        Array.from(uniqueUserIds).map(async (userId) => {
          try {
            const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
            return { userId, profilePhoto: data.profilePhoto || null };
          } catch (error) {
            console.error("Error fetching user profile:", error);
            return { userId, profilePhoto: null };
          }
        })
      );
  
      // Store profile images in state
      const imagesMap = {};
      userProfiles.forEach(({ userId, profilePhoto }) => {
        imagesMap[userId] = profilePhoto;
      });
      setProfileImages(imagesMap);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };
  
  

  const toggleDone = async (id) => {
    try {
      const updatedTask = tasks.find((task) => task._id === id);
      if (!updatedTask) return;
  
      const updatedStatus = !updatedTask.done;
  
      await axios.put(`${API_BASE_URL}/api/tasks/update/${id}`, {
        done: updatedStatus,
        status: updatedStatus ? "Completed" : "In progress",
      });
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id
            ? { ...task, done: updatedStatus, status: updatedStatus ? "Completed" : "In progress" }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  

  const handleEdit = (task) => setEditTask(task);

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
    setEditTask(null);
  };

  const openDeleteModal = (task) => setSelectedTask(task);
  const closeDeleteModal = () => setSelectedTask(null);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/delete/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      closeDeleteModal();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task!");
    }
  };

  const groupTasks = (day) => {
    if (day === "Upcoming") {
      return tasks.filter(
        (task) => task.day !== "Today" && task.day !== "Tomorrow"
      );
    }
    return tasks.filter((task) => task.day === day);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardHeader userName={userName} onSearch={setSearchQuery} searchType="tasks" />
        <div className="task-header">
          <h2>All Tasks</h2>
          {userRole === "admin" && ( // Only show button if user is an admin
            <button className="new-task-btn" onClick={() => setShowTaskModal(true)}>
              <FiPlus /> New Task
            </button>
          )}

        </div>

        <div className="main-task-page">
          {["Today", "Tomorrow", "Upcoming"].map((day) => (
            <div key={day} className="task-section">
              <h2 className="section-title">{day}</h2>
              <TaskGroup
                tasks={groupTasks(day)}
                searchQuery={searchQuery}
                toggleDone={toggleDone}
                handleEdit={handleEdit}
                openDeleteModal={openDeleteModal}
                setSelectedTaskDetails={setSelectedTaskDetails}
                profileImages={profileImages}
                categories={categories}

              />
            </div>
          ))}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          registeredUsers={registeredUsers}
          onTaskAdded={fetchTasks} // Refresh tasks after adding
        />
      )}

      {selectedTask && (
        <DeleteModal
          task={selectedTask}
          onClose={closeDeleteModal}
          onConfirm={() => deleteTask(selectedTask._id)}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}

      {selectedTaskDetails && (
        <TaskDetailsPopup
          task={selectedTaskDetails}
          onClose={() => setSelectedTaskDetails(null)}
        />
      )}
    </div>
  );
};

// TaskGroup Component
const TaskGroup = ({
  tasks,
  searchQuery,
  toggleDone,
  handleEdit,
  openDeleteModal,
  setSelectedTaskDetails,
  profileImages,
  categories
}) => {
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery)
  );
  

  return (
    <div className="task-group">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Due Date</th>
            <th>Stage</th>
            <th>Priority</th>
            <th>Assignee</th>
            <th>Category</th>
            <th>Actions</th>
           
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-tasks">
                No tasks
              </td>
            </tr>
          ) : (
            filteredTasks.map((task) => (
              <tr key={task._id}>
                <td className="task-name-cell">
                <span
  className={`circle ${task.done ? "done" : ""}`}
  onClick={() => toggleDone(task._id)}
>
  {task.done && "✔"}
</span>

                  <span
                    className="task-name"
                    onClick={() => setSelectedTaskDetails(task)}
                    style={{ cursor: "pointer", textDecoration: "underline" }} // 👈 Added styles
                  >
                    {task.name.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>

                </td>
                <td className="due-date-cell">
                  <span className="due-label">{task.day}</span>
                </td>
                <td>
                  <span
                    className={`stage-badge ${
                      task.status === "In progress"
                        ? "stage-inprogress"
                        : "stage-notstarted"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`priority-badge ${
                      task.priority === "High"
                        ? "priority-high"
                        : task.priority === "Medium"
                        ? "priority-medium"
                        : "priority-low"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                
                <td>
                    {task.assignees && Array.isArray(task.assignees) && task.assignees.length > 0 ? (
                      <div className="assignee-list">
                        {task.assignees.map((person, index) => {
                          const profileImg = profileImages[person._id] || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`;
                          return (
                            <img
                              key={index}
                              src={profileImg}
                              alt={person.name}
                              className="avatar-img"
                              style={{ left: `${index * -10}px` }} // Adjust overlap
                            />
                          );
                        })}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{categories?.[task.category] || "-"}</td>


                <td className="actions-cell">
                  <FaEdit className="edit-icon" onClick={() => handleEdit(task)} />
                  <FaTrash className="delete-icon" onClick={() => openDeleteModal(task)} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskPage;
