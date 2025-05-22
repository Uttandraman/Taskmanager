import React, { useContext, useState } from "react";
import "./Login.css";
import logo from "./assets/react.svg"; // Adjust path if needed
import axios from "axios";
import { data } from "react-router-dom";
import { AuthContext } from './AuthContext';
import {Link, useNavigate} from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

   const {user,setUser, login} = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    try{
    const response = await axios.post("http://localhost:5000/api/login", {
      email,
      password,
    });
    const data = response.data;
    //console.log(response);
    if(data.message === "Login successful!"){
      setSuccess(data.message);
      login(response.data.user);
      navigate('/task');
    }
  }catch(err){
    setError(err.response.data.message);
  }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo-title">
            <img src={logo} alt="Taskify Logo" className="login-logo" />
            <h2 className="login-title">Taskify</h2>
          </div>
          <h3 className="login-subtitle">Login</h3>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit">
            Login
          </button>
          {/* <p>{user}</p> */}
        </form>
        <p className="form-footer">
          Don't have an account? <Link to="/"> Signup</Link>
        </p>
      </div>
    </div>
  );
}
