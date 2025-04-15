import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./styles.css";
import "./App.css";

function App() {
  const [success, setSuccess] = useState(false);

  // Listen for successful authentication events from child components
  useEffect(() => {
    const handleAuthSuccess = () => {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/community";
      }, 1500);
    };

    // Listen for custom auth events from login/signup components
    window.addEventListener("auth_login", handleAuthSuccess);

    return () => {
      window.removeEventListener("auth_login", handleAuthSuccess);
    };
  }, []);

  return (
    <div className="auth-container">
      <Container className="mt-5">
        {success ? (
          <Card className="mx-auto" style={{ maxWidth: "400px" }}>
            <Card.Body className="p-4 text-start">
              <div className="d-flex align-items-center mb-3">
                <Spinner animation="border" role="status" className="me-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <h4 className="mb-0">Success!</h4>
              </div>
              <p className="text-muted">Redirecting you to the community dashboard...</p>
            </Card.Body>
          </Card>
        ) : (
          <Row className="justify-content-center">
            <Col md={6} lg={5} className="mb-4 mb-md-0">
              <LoginForm />
            </Col>
            <Col md={6} lg={5}>
              <SignupForm />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default App;
