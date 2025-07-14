 import React, { useState } from "react";
import "../styles/FormStyles.css"; // Optional shared styling

function RegisterForm({ onRegisterSuccess }) {
  const [name, setName] = useState("");     // Full name
  const [email, setEmail] = useState("");   // Email
  const [password, setPassword] = useState(""); // Password
  const [role, setRole] = useState("user"); // Default role
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !role) {
      setErrorMsg("⚠️ All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();

      if (data.token && data.role) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("✅ Registration successful!");
        if (onRegisterSuccess) onRegisterSuccess(data.role);
      } else {
        setErrorMsg(data.message || "❌ Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err.message);
      setErrorMsg("❌ " + err.message);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}
      </form>
    </div>
  );
}

export default RegisterForm;
