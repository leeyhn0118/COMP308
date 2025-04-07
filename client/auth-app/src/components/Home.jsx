// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';  // Use Link for navigation
import { Nav } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Authentication Microservice</h1>
      <p className="home-message">Please login or sign up to continue.</p>
      <div className="nav-buttons">
        <Link to="/login" className="nav-button">Login</Link>
        <br />
        <Link to="/signup" className="nav-button">Sign Up</Link>
      </div>
    </div>
  );
};

export default Home;
