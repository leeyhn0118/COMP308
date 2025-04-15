import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Alert, Button, Form, Card } from "react-bootstrap";

// Register mutation
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

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [register] = useMutation(REGISTER_MUTATION);

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await register({
        variables: { username, email, password, role }
      });

      if (data && data.register) {
        localStorage.setItem("token", data.register.token);
        localStorage.setItem("user", JSON.stringify(data.register.user));

        // Notify parent app of successful registration
        window.dispatchEvent(
          new CustomEvent("auth_login", {
            detail: {
              user: data.register.user,
              token: data.register.token
            }
          })
        );

        // Redirect handled by parent component
        return true;
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Registration error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body className="text-start">
        <h4 className="mb-3">Sign Up</h4>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
              <option value="resident">Resident</option>
              <option value="business_owner">Business Owner</option>
              <option value="community_organizer">Community Organizer</option>
            </Form.Select>
            <Form.Text className="text-muted">Select your role in the community</Form.Text>
          </Form.Group>

          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SignupForm;
