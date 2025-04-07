import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMMUNITY_POSTS } from '../../queries';
import { Link } from 'react-router-dom';
import './CommunityPosts.css';

const CommunityPosts = () => {
  const { loading, error, data } = useQuery(GET_COMMUNITY_POSTS, {
    fetchPolicy: 'cache-and-network', // Ensure fresh data
    pollInterval: 60000 // Refresh every 60 seconds
  });

  if (loading && !data) return <div className="loading-message">Loading posts...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  const posts = data?.getAllCommunityPosts || [];

  return (
    <div className="community-posts-container">
      <div className="posts-header">
        <h2>Community Posts</h2>
        <Link to="/create-post" className="create-post-button">
          Create New Post
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className="no-posts-message">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3>{post.title}</h3>
                <span className={`post-category ${post.category}`}>
                  {post.category}
                </span>
              </div>
              
              <div className="post-content">
                {post.content.length > 150 
                  ? `${post.content.substring(0, 150)}...` 
                  : post.content}
              </div>
              
              {post.aiSummary && (
                <div className="post-summary">
                  <strong>AI Summary:</strong> {post.aiSummary}
                </div>
              )}
              
              <div className="post-footer">
                <span className="post-author">
                  Posted by: {post.author?.username || 'Anonymous'}
                </span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPosts;