import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// GraphQL mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

function UserComponent({ activeTab }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident'); // Default role
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      localStorage.setItem('token', token); // Store token
      console.log('Logged in as:', user.username);
      navigate('/'); // Redirect to home or dashboard after login
    },
    onError: (error) => setAuthError(error.message || 'Login failed'),
  });

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.register;
      localStorage.setItem('token', token); // Store token
      console.log('Registration successful, logged in as:', user.username);
      navigate('/login'); // Redirect to login after successful registration
    },
    onError: (error) => setAuthError(error.message || 'Registration failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    if (activeTab === 'signup') {
      if (!username || !password || !email || !role) {
        setAuthError('All fields are required.');
        setIsSubmitting(false);
        return;
      }
      await register({ variables: { username, email, password, role } });
    } else {
      if (!email || !password) {
        setAuthError('Email and password are required.');
        setIsSubmitting(false);
        return;
      }
      await login({ variables: { email, password } });
    }
    setIsSubmitting(false);
  };

  return (
    <Container className="p-5">
      <h2>{activeTab === 'login' ? 'Login' : 'Sign Up'}</h2>
      <Form onSubmit={handleSubmit} className="mt-3">
        {activeTab === 'signup' && (
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
        )}
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
        {authError && <Alert variant="danger">{authError}</Alert>}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          ) : activeTab === 'login' ? (
            'Login'
          ) : (
            'Sign Up'
          )}
        </Button>
      </Form>
    </Container>
  );
}

export default UserComponent;