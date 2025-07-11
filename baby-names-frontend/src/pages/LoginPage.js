 // src/pages/LoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/FormStyles.css";
 // Make sure this file exists!

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = (role) => {
    if (onLoginSuccess) {
      onLoginSuccess(role); // ✅ Update global auth state in App.js
    }

    // ✅ Redirect to appropriate page after login
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/chart");
    }
  };

  return (
    <div className="page-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <LoginForm onLoginSuccess={handleSuccess} />
        <p className="note">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
