import React, { useState } from "react";
import "../../styles/Login.css"; // Reuse same CSS for consistency
import { useNavigate } from "react-router-dom";
import config from "../../../config";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = config.API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("User registered successfully!");
        navigate("/");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side */}
        <div className="login-left">
          <h2>Welcome!</h2>
          <p>Create your account to get started with us.</p>
          <div className="decorative-circle circle-top"></div>
          <div className="decorative-circle circle-bottom"></div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <h3>Register</h3>

          {success && <p className="success-text">{success}</p>}
          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <a href="/">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
