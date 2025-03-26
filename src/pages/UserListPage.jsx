import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";
import "../styles/UserListPage.css";
import { FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";

const UserListPage = () => {
  const API_BASE_URL = config.API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedRole, setCheckedRole] = useState(false);

  const token = localStorage.getItem("token");
  const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
      fetchUsers();
    }
    setCheckedRole(true);
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users/");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!checkedRole) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <DashboardHeader />
        <div className="userlist-container">
          <h2>Members List</h2>

          {!isAdmin ? (
            <div className="no-access">
              <h3>You don't have access to this page.</h3>
            </div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                     <td>
                        <div className="userprofile-container">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              className="user-avatar"
                            />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </td>

                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <div
                          className="delete-icon"
                          onClick={() => deleteUser(user._id)}
                          title="Delete User"
                        >
                          <FaTrash />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
