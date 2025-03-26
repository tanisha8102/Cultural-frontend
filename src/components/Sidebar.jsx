import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiGrid, FiCheckCircle, FiBell, FiSettings, FiLogOut, FiUser, FiCalendar, FiUsers, FiFolder, FiSpeaker } from "react-icons/fi";
import "../styles/Sidebar.css";
import config from "../../config";
import axios from "axios";
import logo from "../assets/logo-placeholder-image.png"

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const API_BASE_URL = config.API_BASE_URL;

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return;
  //       const { data } = await axios.get(`${API_BASE_URL}/api/notifications`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       // Count unread notifications manually if /unread route is missing
  //       const unreadCount = data.filter((notif) => notif.isNew).length;
  //       setUnreadNotifications(unreadCount);
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const userName = localStorage.getItem("userName") || "User";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
      <div className="profile-icon">
        <img src={logo} alt="Donezo Logo" className="logo-image" />
      </div>

        <h2>CultureLink</h2>
      </div>

      <ul className="sidebar-menu">
        <li
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          <FiGrid className="menu-icon" /> Dashboard
        </li>
        <li
          className={location.pathname === "/events" ? "active" : ""}
          onClick={() => navigate("/events")}
        >
          <FiCalendar className="menu-icon" /> Events
        </li>
        <li
          className={location.pathname === "/tasks" ? "active" : ""}
          onClick={() => navigate("/tasks")}
        >
          <FiCheckCircle className="menu-icon" /> Tasks
        </li>
        <li
          className={location.pathname === "/memeber-management" ? "active" : ""}
          onClick={() => navigate("/memeber-management")}
        >
          <FiUsers className="menu-icon" /> Members
        </li>
        <li
          className={location.pathname === "/resource-management" ? "active" : ""}
          onClick={() => navigate("/resource-management")}
        >
          <FiFolder className="menu-icon" /> Resources
        </li>
        <li
          className={location.pathname === "/announcement" ? "active" : ""}
          onClick={() => navigate("/announcement")}
        >
          <FiSpeaker className="menu-icon" /> Announcements
        </li>
        <li
          className={location.pathname === "/notifications" ? "active" : ""}
          onClick={() => navigate("/notifications")}
        >
          <FiBell className="menu-icon" /> Notifications
          {unreadNotifications > 0 && (
            <span className="notification-badge">{unreadNotifications}</span>
          )}
        </li>
        <li
          className={location.pathname === "/profile" ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          <FiUser className="menu-icon" /> Profile
        </li>
        <div className="bottom-menu">
          {/* <li
            className={location.pathname === "/settings" ? "active" : ""}
            onClick={() => navigate("/settings")}
          >
            <FiSettings className="menu-icon" /> Settings
          </li> */}
          <li onClick={handleLogout}>
            <FiLogOut className="menu-icon" /> Log out
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
