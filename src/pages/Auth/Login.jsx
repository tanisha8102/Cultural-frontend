import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import config from "../../../config";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
 const API_BASE_URL = config.API_BASE_URL;
  const navigate = useNavigate();

  

  // Auto-fill email & password if saved
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token & user data based on "Remember Me"
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.accessToken);
        storage.setItem("refreshToken", data.refreshToken);
        storage.setItem("userName", data.user.name);
        storage.setItem("userId", data.user.id);
        storage.setItem("role", data.user.role);

        // Save email & password if "Remember Me" checked
        if (rememberMe) {
          localStorage.setItem("savedEmail", email);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }

        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);
  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h2>Welcome back!</h2>
          <p>You can sign in to access with your existing account.</p>
          <div className="decorative-circle circle-top"></div>
          <div className="decorative-circle circle-bottom"></div>
        </div>

        <div className="login-right">
          <h3>Log In</h3>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Username or Email"
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

              <div className="form-options">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />{" "}
                  Remember me
                </label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>

          <p className="signup-text">
            New here? <a href="/signup">Create an Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
