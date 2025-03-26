import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import "../styles/ProfilePage.css";
import defaultProfile from "../assets/images.jpeg";
import config from "../../config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FeedbackModal from "../components/FeedbackForm";

const ProfilePage = () => {
  const [userData, setUserData] = useState({ name: "", email: "", contact: "", dob: "", address: "", profilePhoto: "" });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(defaultProfile);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = config.API_BASE_URL;
  const userId = localStorage.getItem("userId");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
        setUserData(data);
        setPreview(data.profilePhoto || defaultProfile);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contact" && !/^\d{0,10}$/.test(value)) return;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!userData.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    if (userData.contact && !/^\d{10}$/.test(userData.contact)) {
      toast.error("Contact number must be exactly 10 digits.");
      return;
    }

    setLoading(true);
    try {
      let profilePhoto = userData.profilePhoto;

      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        const uploadRes = await axios.put(`${API_BASE_URL}/api/users/${userId}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePhoto = uploadRes.data.url;
      }

      const updatedUser = { ...userData, profilePhoto };
      const { data } = await axios.put(`${API_BASE_URL}/api/users/${userId}`, updatedUser);

      setUserData(data);
      setPreview(profilePhoto || defaultProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
       
        <div className="profile-container">
        <button className="feedback-button" onClick={() => setShowFeedback(true)}>Feedback</button>
          
        <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

          <h2>Profile Details</h2>
          <div className="profile-card">
            <div className="profile-photo-wrapper">
              <img src={preview} alt="Profile" className="profile-photo" />
              <div className="upload-section">
                <input type="file" onChange={handlePhotoChange} accept="image/*" hidden id="upload-photo" />
                <label htmlFor="upload-photo" className="upload-btn">+ Upload photo</label>
              </div>
            </div>
            <div className="profile-details-grid">
              <div className="profile-column">
                <label>Full Name*</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} placeholder="Enter your name" />
                <label>Email Address</label>
                <p>{userData.email || "No email available"}</p>
              </div>
              <div className="profile-column">
                <label>Contact</label>
                <input type="text" name="contact" value={userData.contact} onChange={handleChange} placeholder="Enter your contact" maxLength="10" />
                <label>Date of Birth</label>
                <input type="date" name="dob" value={userData.dob} onChange={handleChange} />
              </div>
              <div className="profile-column">
                <label>Address</label>
                <input type="text" name="address" value={userData.address} onChange={handleChange} placeholder="Enter your address" />
              </div>
            </div>
            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
