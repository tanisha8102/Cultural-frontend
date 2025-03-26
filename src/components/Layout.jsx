import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import "../styles/Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");

    if (!token) {
      navigate("/"); // Redirect to login
    } else {
      setUserName(name); // Set user name
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardHeader userName={userName} />
        <div className="main-dashboard">
          <Outlet /> {/* This will render the page content dynamically */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
