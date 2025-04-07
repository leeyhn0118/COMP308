// src/components/Register.jsx
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
    register(username: $username, email: $email, password: $password, role: $role) {
      token
      user {
        id
        username
        email
        role
      }
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');  // Default role
  const [authError, setAuthError] = useState('');
  
  // Initialize navigate from react-router-dom
  const navigate = useNavigate();

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.register;
      localStorage.setItem('token', token); // Store token in localStorage
      console.log('Registration successful, logged in as:', user.username);

      // Navigate to the login page after successful registration
      navigate('/login');
    },
    onError: (error) => setAuthError(error.message || 'Registration failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !role) {
      setAuthError('All fields are required.');
      return;
    }
    await register({ variables: { username, email, password, role } });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="resident">Resident</option>
            <option value="business_owner">Business Owner</option>
            <option value="community_organizer">Community Organizer</option>
          </Form.Control>
        </Form.Group>
        {authError && <Alert variant="danger">{authError}</Alert>}
        <Button variant="primary" type="submit">Sign Up</Button>
      </Form>
    </div>
  );
};

export default Register;
