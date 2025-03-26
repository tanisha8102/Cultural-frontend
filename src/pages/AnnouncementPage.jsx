import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Announcements.css";
import DashboardHeader from "../components/DashboardHeader";
import AnnouncementModal from "../components/AnnouncementModal";
import DeleteModal from "../components/DeleteModal";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import config from "../../config";

const AnnouncementPage = () => {
  const API_BASE_URL = config.API_BASE_URL;
  const [activeTab, setActiveTab] = useState("All");
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements`);
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        toast.error("Failed to fetch announcements.");
      }
    };

    fetchAnnouncements();
    setUserRole(localStorage.getItem("role"));
  }, []);

  const handleAnnouncementAdded = (newAnnouncement) => {
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
  };

  const handleDeleteClick = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/announcements/${announcementToDelete._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAnnouncements((prev) => prev.filter((a) => a._id !== announcementToDelete._id));
        toast.success("Announcement deleted successfully.");
      } else {
        toast.error("Failed to delete announcement.");
      }
    } catch (error) {
      toast.error("Error deleting announcement.");
    }
    setDeleteModalOpen(false);
    setAnnouncementToDelete(null);
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && announcement.isActive) ||
      (activeTab === "Inactive" && !announcement.isActive);
    const matchesSearch =
      announcement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardHeader userName={userName} onSearch={setSearchQuery} searchType="announcements" />
        <div className="announcement-container">
          <div className="announcement-header">
            <div className="announcement-tabs">
              {["All", "Active", "Inactive"].map((tab) => (
                <button key={tab} className={`announcement-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
            {userRole === "admin" && (
              <button className="announcement-btn" onClick={() => setIsModalOpen(true)}>
                Create Announcement
              </button>
            )}
          </div>
          <div className="announcement-list">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement) => (
                <div key={announcement._id} className="announcement-item">
                  <p className="announcement-date">
                    {new Date(announcement.dateTime).toLocaleDateString()} <br />
                    <span className="announcement-time">{new Date(announcement.dateTime).toLocaleTimeString()}</span>
                  </p>
                  <div className="announcement-content">
                    <h2 className="announcement-title">{announcement.name}</h2>
                    <p className="announcement-description">{announcement.description}</p>
                  </div>
                  {userRole === "admin" && (
                    <FaTrash className="delete-icon" onClick={() => handleDeleteClick(announcement)} />
                  )}
                </div>
              ))
            ) : (
              <p>No announcements found.</p>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && <AnnouncementModal onClose={() => setIsModalOpen(false)} onAnnouncementAdded={handleAnnouncementAdded} />}
      {deleteModalOpen && <DeleteModal onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />}
    </div>
  );
};

export default AnnouncementPage;
