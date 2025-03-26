import React, { useEffect, useState } from "react";
import { FaBriefcase, FaUsers, FaPalette, FaCalendarAlt, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import "../styles/CategoryList.css";
import config from "../../config";
import DeleteModal from "./DeleteModal"; // Import delete modal

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const API_BASE_URL = config.API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchCategories = async () => {
    const token = getToken();
    if (!token) {
      console.error("No token, authorization denied");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data);

      // Fetch task count for each category
      data.forEach((category) => {
        fetchTaskCount(category._id);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTaskCount = async (categoryId) => {
    const token = getToken();
    if (!token) {
      console.error("No token, authorization denied");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/category/${categoryId}/count`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch task count for category ${categoryId}`);
      }

      const data = await response.json();
      setTaskCounts((prevCounts) => ({
        ...prevCounts,
        [categoryId]: data.taskCount || 0,
      }));
    } catch (error) {
      console.error(`Error fetching task count for category ${categoryId}:`, error);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    const token = getToken();
    if (!token) {
        console.error("No token, authorization denied");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newCategory }),
        });

        if (!response.ok) {
            throw new Error("Failed to create category");
        }

        setNewCategory("");
        setIsModalOpen(false);

        await fetchCategories(); // Re-fetch categories to ensure correct state
    } catch (error) {
        console.error("Error creating category:", error);
    }
};



  const capitalizeWords = (str) => {
    if (!str) return ""; // Handle undefined or null case
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;

    const token = getToken();
    if (!token) {
      console.error("No token, authorization denied");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/delete/${categoryToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories(categories.filter((category) => category._id !== categoryToDelete._id));
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const getCategoryIcon = (name) => {
    if (!name) return <FaBriefcase className="category-icon" />; // Default icon if name is missing

    switch (name.toLowerCase()) {
      case "work":
        return <FaBriefcase className="category-icon" />;
      case "family":
        return <FaUsers className="category-icon" />;
      case "freelance":
        return <FaPalette className="category-icon" />;
      case "conference":
        return <FaCalendarAlt className="category-icon" />;
      default:
        return <FaBriefcase className="category-icon" />;
    }
  };

  return (
    <div className="category-container">
      <h3>My Categories</h3>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category._id} className="category-item">
            <div className="category-info">
              {getCategoryIcon(category.name)}
              <span>{capitalizeWords(category.name || "Unnamed")}</span>

            </div>
            <span className="task-count">{taskCounts[category._id] ?? 0}</span>
            <FaTrash className="delete-icon" onClick={() => confirmDelete(category)} />
          </li>
        ))}
        <li className="category-item add-category" onClick={() => setIsModalOpen(true)}>
          <FaPlus className="category-icon" />
          <span>Add more</span>
        </li>
      </ul>

      {/* Modal for Creating Category */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </button>
            <h3>Create New Category</h3>
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="create-btn" onClick={createCategory}>
              Create
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <DeleteModal
          task={categoryToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={deleteCategory}
        />
      )}
    </div>
  );
};

export default CategoryList;
