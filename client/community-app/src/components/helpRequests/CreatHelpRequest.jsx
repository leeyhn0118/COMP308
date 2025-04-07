import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_HELP_REQUEST } from "../../queries";
import { useNavigate } from "react-router-dom";
import './CreateHelpRequest.css';

const CreateHelpRequest = () => {
  const [formData, setFormData] = useState({
    description: "",
    location: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [createHelpRequest, { loading }] = useMutation(CREATE_HELP_REQUEST, {
    onCompleted: () => {
      alert("Help request created successfully!");
      navigate("/help-requests");
    },
    onError: (err) => {
      console.error("Error creating help request:", err);
      setErrors({
        submit: err.message.replace('GraphQL error: ', '')
      });
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await createHelpRequest({
        variables: { 
          description: formData.description.trim(),
          location: formData.location.trim() || undefined 
        },
      });
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };

  return (
    <div className="create-help-request-container">
      <div className="form-wrapper">
        <h2>Create New Help Request</h2>
        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength="20"
              rows="5"
              placeholder="Describe what help you need in detail..."
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>
          
          <div className="form-group">
            <label>Location (Optional)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where do you need help? (e.g. City, Address)"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Submit Request'}
            </button>
            
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => navigate("/help-requests")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHelpRequest;