 import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChartPage from "./components/ChartPage";
import AdminDashboard from "./pages/AdminDashboard";
import FavoritesPage from "./pages/FavoritesPage";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setRole(storedRole);
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark" : ""}`}>
        <header className="navbar">
          <h1>Baby Names Visualization</h1>
          <nav>
            {isAuthenticated ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/chart">Chart</Link>
                {role === "admin" && <Link to="/admin">Admin</Link>}
                <Link to="/favorites">Favorites</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <ChartPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/chart"
              element={
                isAuthenticated ? <ChartPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated && role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/favorites"
              element={
                isAuthenticated ? <FavoritesPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/login"
              element={
                <LoginPage
                  onLoginSuccess={(userRole) => {
                    setIsAuthenticated(true);
                    setRole(userRole);
                  }}
                />
              }
            />
            <Route
              path="/register"
              element={
                <RegisterPage
                  onRegisterSuccess={(userRole) => {
                    setIsAuthenticated(true);
                    setRole(userRole);
                  }}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
