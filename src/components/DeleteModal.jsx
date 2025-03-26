import React from "react";
import { FaTrash } from "react-icons/fa";
import "../styles/DeleteModal.css"; // Import styles

const DeleteModal = ({ task, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="delete-modal-content">
        <FaTrash className="modal-icon" />
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete ?</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="delete-btn" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
