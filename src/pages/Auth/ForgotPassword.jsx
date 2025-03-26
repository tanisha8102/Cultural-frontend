import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../../config";
import "../../styles/ForgotPassword.css";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = config.API_BASE_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password?</h2>
      <p>Enter your email, and we'll send you a link to reset your password.</p>
      
      <form onSubmit={handleForgotPassword}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
