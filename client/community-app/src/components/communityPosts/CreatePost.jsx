import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_COMMUNITY_POST } from '../../queries';
import { useNavigate } from 'react-router-dom';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('news'); // Default to 'news'
  const [aiSummary, setAiSummary] = useState('');
  const navigate = useNavigate();

  const [createPost] = useMutation(CREATE_COMMUNITY_POST, {
    onCompleted: () => {
      alert('Post created successfully!');
      navigate('/community-posts'); // Redirect after successful creation
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ 
        variables: { 
          title, 
          content, 
          category, 
          aiSummary: aiSummary || undefined // Send undefined if empty
        } 
      });
    } catch (err) {
      console.error('Error creating post:', err);
      alert(`Failed to create post: ${err.message}`);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create a New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength="5"
            maxLength="100"
          />
        </div>
        
        <div className="form-group">
          <label>Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength="10"
            rows="6"
          />
        </div>
        
        <div className="form-group">
          <label>Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="news">News</option>
            <option value="discussion">Discussion</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>AI Summary (Optional)</label>
          <textarea
            value={aiSummary}
            onChange={(e) => setAiSummary(e.target.value)}
            rows="3"
            placeholder="Provide a brief AI-generated summary..."
          />
        </div>
        
        <button type="submit" className="submit-button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;