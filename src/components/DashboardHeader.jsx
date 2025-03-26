import React, { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import axios from "axios";
import "../styles/DashboardHeader.css";
import config from "../../config";
import { Link } from "react-router-dom"; // Assuming you are using react-router

const DashboardHeader = ({ onSearch, placeholder = "Search..." ,searchType = "tasks"}) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userName, setUserName] = useState("User");
  const [unreadCount, setUnreadCount] = useState(0); // For notification count
  const API_BASE_URL = config.API_BASE_URL;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    onSearch(query);
  };


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // Fetch users
    axios.get(`${API_BASE_URL}/api/users`)
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch logged-in user's profile
    if (userId) {
      axios.get(`${API_BASE_URL}/api/users/${userId}`)
        .then(({ data }) => {
          setUserName(data.name || "User");
          if (data.profilePhoto) {
            setProfilePhoto(data.profilePhoto);
          }
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }

    // Fetch notifications
    // fetchNotifications();
  }, []);

  // const fetchNotifications = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const { data } = await axios.get(`${API_BASE_URL}/api/notifications`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const unread = data.filter((notif) => !notif.isRead).length;
  //     setUnreadCount(unread);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // Every 5 seconds (adjustable)

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="dashboard-header">
     <input
        type="text"
        placeholder={`Search ${searchType}...`} // Dynamic placeholder
        className="dashboard-search"
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="header-actions">
        Notification Icon
        <Link to="/notifications" className="notification-icon">
          <FiBell />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </Link>

        {/* Profile */}
        <div className="profile-circle">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="profile-img" />
          ) : (
            <span>{userName.charAt(0).toUpperCase()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
