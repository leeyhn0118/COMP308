// src/components/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Use useNavigate for navigation
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Navigate back to the auth-app home page when return button is clicked
  const handleReturnToAuthApp = () => {
    window.location.href = "http://localhost:5173";  // Redirect to the auth-app's home page
  };

  return (
    <div className="home-container">
      <h1>Community Posts</h1>
      <div className="links-container">
        <Link to="/community-posts" className="home-link">View Community Posts</Link>
        <Link to="/create-post" className="home-link">Create New Post</Link>
        <Link to="/help-requests" className="home-link">View Help Requests</Link>
        <Link to="/create-help-request" className="home-link">Create Help Request</Link>
        <Link to="/ai-chat-bot" className="chat-bot">Chat with us!</Link>
      </div>
      {/* Return button to go back to auth-app's home page */}
      <button onClick={handleReturnToAuthApp} className="return-btn">
        Return to Auth App Home
      </button>
    </div>
  );
};

export default Home;
