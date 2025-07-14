 // src/components/LoginForm.js
import React, { useState } from "react";
import "../styles/FormStyles.css"; // optional styling

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // clear previous error

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();

      // Save token and role to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Trigger success handler (navigate to home page)
      onLoginSuccess(data.role);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg(error.message || "Backend might be down.");
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
        {errorMsg && <p className="error-msg">❌ {errorMsg}</p>}
      </form>
    </div>
  );
}

export default LoginForm;
