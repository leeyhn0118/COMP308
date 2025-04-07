import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setToken(storedToken);
    setUsername(storedUsername);
  }, []);

  const handleLogoutAndRedirect = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    window.location.href = "http://localhost:5173"; 
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Community App
        </Link>

        <div className="navbar-links">
          {!token ? (
            <div className="auth-links">
              <Link 
                to="#" 
                onClick={handleLogoutAndRedirect} 
                className="nav-link hello-link"
              >
                Hello
              </Link>
            </div>
          ) : (
            <div className="user-info">
              <span className="username">Welcome, {username}</span>
              <Link 
                to="#" 
                onClick={handleLogoutAndRedirect} 
                className="nav-link logout-link"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;