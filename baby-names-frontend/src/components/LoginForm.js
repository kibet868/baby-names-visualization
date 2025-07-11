 import React, { useState } from "react";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Login failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.token && data.role) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          alert("✅ Login successful!");

          if (onLoginSuccess) {
            onLoginSuccess(data.role); // e.g., navigate to chart/admin
          }
        } else {
          alert(data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        alert("❌ Login error. Backend might be down.");
      });
  };

  return (
    <form onSubmit={handleLogin} className="form-container">
      <h2>Login</h2>
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
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
