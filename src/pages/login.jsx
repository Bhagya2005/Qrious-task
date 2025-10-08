import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../css/Login.css";

function Login() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === loginData.email.toLowerCase() &&
        u.password === loginData.password
    );

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-heading">Welcome Back</h2>
        <form className="login-form">
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={loginData.email}
            onChange={handleChange}
            className="login-input"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
            className="login-input"
          />
          <button type="submit" className="login-button" onClick={handleLogin}>
            Login
          </button>
        </form>

        <p className="login-text">
          Don’t have an account?{" "}
          <span className="login-link" onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
