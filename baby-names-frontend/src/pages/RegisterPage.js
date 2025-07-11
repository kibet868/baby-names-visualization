 // src/pages/RegisterPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import "../styles/FormStyles.css";
 // ✅ Make sure this file exists

function RegisterPage({ onRegisterSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = (role) => {
    if (onRegisterSuccess) {
      onRegisterSuccess(role);
    }

    // Redirect after successful registration
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/chart");
    }
  };

  return (
    <div className="register-page-container">
      <RegisterForm onRegisterSuccess={handleSuccess} />
    </div>
  );
}

export default RegisterPage;
