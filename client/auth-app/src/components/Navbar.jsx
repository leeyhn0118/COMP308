import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Navbar = () => {
  const navigate = useNavigate();

  // Check if the user is logged in (i.e., check if token exists in localStorage)
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');  // Retrieve the username from localStorage

  // Logout function to clear localStorage and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token
    localStorage.removeItem('username');  // Optionally remove other user info
    navigate('/login');  // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">Auth App</Link>
        
        <div className="navbar-links">
          {/* Show Login and Sign Up buttons if not logged in */}
          {!token ? (
            <div className="auth-links">
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </div>
          ) : (
            <div className="user-info">
              {/* Show the user's username if logged in */}
              <span className="username">Welcome, {username}</span>
              {/* Logout button */}
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
