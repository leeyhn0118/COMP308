import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_HELP_REQUESTS } from '../../queries'; // Import the query
import { Link } from 'react-router-dom';
import './HelpRequests.css';

const HelpRequests = () => {
  const { loading, error, data } = useQuery(GET_HELP_REQUESTS, {
    fetchPolicy: 'network-only', // Start with fresh data
    errorPolicy: 'all' // Get partial results if available
  });

  // Debugging logs
  console.log("GraphQL Response:", { loading, error, data });
  
  // Handle loading state
  if (loading) return <div className="loading">Loading help requests...</div>;

  // Handle error state
  if (error) {
    console.error("Full error details:", error);
    return (
      <div className="error">
        Error loading help requests: {error.message}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Handle case when no help requests exist
  const requests = data?.getAllHelpRequests || [];

  return (
    <div className="help-requests-container">
      <div className="header-section">
        <h2>Community Help Requests</h2>
        <Link to="/create-help-request" className="create-button">
          Create New Request
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <p>No help requests found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className={`request-card ${request.isResolved ? 'resolved' : ''}`}>
              <div className="card-header">
                <h3>{request.description}</h3>
                <span className={`status-badge ${request.isResolved ? 'resolved' : 'pending'}`}>
                  {request.isResolved ? 'Resolved' : 'Needs Help'}
                </span>
              </div>
              
              {request.location && (
                <div className="location">
                  <i className="location-icon">📍</i>
                  {request.location}
                </div>
              )}
              
              <div className="meta-info">
                <span className="author">
                  Posted by: {request.author?.username || 'Anonymous'}
                </span>
                <span className="date">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="volunteers">
                {request.volunteers?.length > 0 ? (
                  <span>{request.volunteers.length} volunteer(s)</span>
                ) : (
                  <span>No volunteers yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HelpRequests;
