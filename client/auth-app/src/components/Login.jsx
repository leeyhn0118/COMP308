import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.login;
      localStorage.setItem('token', token);  // Store token in localStorage
      localStorage.setItem('username', user.username);  // Store username in localStorage
      console.log('Logged in as:', user.username);

      // After successful login, navigate to the Community App's posts page
      window.location.href = 'http://localhost:5174'; // Directly navigate to the community app
    },
    onError: (error) => setAuthError(error.message || 'Login failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Email and password are required.');
      return;
    }
    await login({ variables: { email, password } });
  };

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
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
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </div>
  );
};

export default Login;
