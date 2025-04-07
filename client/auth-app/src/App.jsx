// src/App.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';  // Import Home component
import Login from './components/Login';  // Import Login component
import Register from './components/Register';  // Import Register component
import Navbar from './components/Navbar';  // Import Navbar component
// import CommunityPosts from '../../community-app/src/components/CommunityPosts';

function App() {
  return (
    <div className="app-container">
      <Navbar />  {/* Navbar will be visible on all pages */}
      
      <Routes>
        {/* Home route with links to Login and Sign Up */}
        <Route path="/" element={<Home />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/signup" element={<Register />} />

        {/* <Route path="/community" element={<CommunityPosts />} /> */}
      </Routes>
    </div>
  );
}

export default App;
