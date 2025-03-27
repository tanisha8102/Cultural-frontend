import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import CalendarWidget from "../components/CalendarWidget";
import UpcomingEvents from "../components/UpcomingEvents";
import config from "../../config";

const Dashboard = () => {
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0); // State for announcements
  const API_BASE_URL = config.API_BASE_URL;

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/upcoming`);
        const data = await response.json();
        if (response.ok) setUpcomingEventsCount(data.count);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/count`);
        const data = await response.json();
        if (response.ok) setUserCount(data.count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    const fetchPendingTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/pending`);
        const data = await response.json();
        if (response.ok) setPendingTasksCount(data.count);
      } catch (error) {
        console.error("Error fetching pending tasks:", error);
      }
    };

    const fetchAnnouncementCount = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/announcements/`);
        const data = await response.json();
        if (response.ok) setAnnouncementCount(data.count);
      } catch (error) {
        console.error("Error fetching announcements count:", error);
      }
    };

    fetchUpcomingEvents();
    fetchUserCount();
    fetchPendingTasks();
    fetchAnnouncementCount();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="stats-container">
          <div className="stat-card orange">
            <span className="stat-number">{upcomingEventsCount}</span>
            <span className="stat-label">Upcoming Events</span>
            <a href="/events">View all &gt;</a>
          </div>
          <div className="stat-card teal">
            <span className="stat-number">{userCount}</span>
            <span className="stat-label">Active Members</span>
            <a href="memeber-management">View all &gt;</a>
          </div>
          <div className="stat-card yellow">
            <span className="stat-number">{pendingTasksCount}</span>
            <span className="stat-label">Pending Tasks</span>
            <a href="/tasks">View all &gt;</a>
          </div>
          <div className="stat-card pink">
            <span className="stat-number">{announcementCount}</span> {/* Updated here */}
            <span className="stat-label">Announcements</span>
            <a href="/announcements">View all &gt;</a>
          </div>
        </div>

        <div className="main-content">
          <div className="upcoming-events">
            <h3>Upcoming Events</h3>
            <UpcomingEvents />
          </div>
          <div className="calendar-section">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
