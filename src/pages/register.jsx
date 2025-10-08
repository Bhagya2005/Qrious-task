import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../css/Register.css"; 

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword, gender, address } = form;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !gender || !address) {
      alert("Please fill all fields!");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(password)) {
      alert("Password must contain uppercase, lowercase, number, and special character!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      alert("Email already registered! Please login instead.");
      return;
    }

    users.push({ firstName, lastName, email, password, gender, address });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-heading">Create Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="register-input" />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="register-input" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="register-input" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="register-input" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="register-input" />

          <small className="password-hint">
            Password must contain uppercase, lowercase, number, and special character.
          </small>

          <select name="gender" value={form.gender} onChange={handleChange} className="register-select">
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <textarea
            name="address"
            placeholder="Address"
            rows="2"
            value={form.address}
            onChange={handleChange}
            className="register-textarea"
          ></textarea>

          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="register-text">
          Already have an account?{" "}
          <span className="register-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
