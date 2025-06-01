// SignupPage.jsx
import React, { useState } from "react";
import "../Signup/SignUp.css";
import logo from "../assets/react.svg"; // Adjust path if needed
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        name,
        email,
        password,
      });

      //console.log(response.message);
      if (response.data.message === "Signup successful!") {
        setSuccess("Signup successfully");
        navigate('/task');
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Logo + App Name Header */}
        <div className="signup-header">
          <div className="logo-title">
            <img src={logo} alt="Taskify Logo" className="signup-logo" />
            <h2 className="signup-title">Taskify</h2>
          </div>
          <h3 className="signup-subtitle">Sign Up</h3>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit">Sign Up</button>
        </form>
        <p className="form-footer">
          Already have an account? <Link to="/"> Login here</Link>
        </p>
      </div>
    </div>
  );
}
