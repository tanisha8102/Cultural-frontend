import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import axios from "axios";
import config from "../../config";
import "../styles/NotificationPage.css";
import { FaTrash } from "react-icons/fa"; // Import delete icon (FontAwesome)

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const API_BASE_URL = config.API_BASE_URL;
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    markNotificationsAsRead();
  }, []);
  

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Authorization denied.");
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Authorization denied.");
        return;
      }
  
      await axios.put(`${API_BASE_URL}/api/notifications/mark-as-read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Notifications marked as read.");
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };
  

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Authorization denied.");
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update UI by filtering out deleted notification
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardHeader userName={userName} onSearch={setSearchQuery} />
        <div className="notification-container">
          <div className="notification-header">
            <h2>Latest notifications</h2>
            <div className="options-icon">⋮</div>
          </div>
          <ul className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <li key={notif._id} className={`notification-item ${notif.isNew ? "highlight" : ""}`}>
                  <div className="notification-content">
                  <div className="notification-content">
  {notif.taskId ? (
    <>
      <strong className={`task-name ${notif.status === "completed" ? "completed" : ""}`}>
        {notif.taskId.name}
      </strong>
      <p className="notification-text">
        {notif.message}
      </p>
    </>
  ) : (
    <>
      <strong className="task-name deleted-task">Deleted Task</strong>
      <p className="notification-text">
        This task has been deleted.
      </p>
    </>
  )}
</div>

                  </div>
                  <div 
                    className="delete-icon" 
                    onClick={() => deleteNotification(notif._id)}
                    title="Delete Notification"
                  >
                    <FaTrash />
                  </div>
                </li>
              ))
            ) : (
              <p>No notifications yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
