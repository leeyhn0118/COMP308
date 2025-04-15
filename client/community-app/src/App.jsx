// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home"; // Import Home component
import CommunityPosts from "./components/communityPosts/CommunityPosts"; // Import CommunityPosts component
import CreatePost from "./components/communityPosts/CreatePost"; // Import CreatePost component
import HelpRequests from "./components/helpRequests/HelpRequests"; // Import HelpRequests component
import CreateHelpRequest from "./components/helpRequests/CreatHelpRequest";
import ChatBot from "./components/ChatBot"; // Import ChatBot component

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route displaying community posts */}
        <Route path="/community-posts" element={<CommunityPosts />} /> {/* Community Posts page */}
        <Route path="/create-post" element={<CreatePost />} /> {/* Create Post page */}
        <Route path="/help-requests" element={<HelpRequests />} /> {/* Help Requests page */}
        <Route path="/create-help-request" element={<CreateHelpRequest />} /> {/* Create Help Request page */}
        <Route path="/ai-chat-bot" element={<ChatBot />} /> {/* AI Chat Bot page */}
      </Routes>
    </div>
  );
}

export default App;
