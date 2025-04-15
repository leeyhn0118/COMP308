import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { ApolloProvider, useApolloClient } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import client from "./apolloClient";

const Auth = lazy(() => import("auth/App"));
const Community = lazy(() => import("community/App"));

// Wrapper to share Apollo client with micro frontends
function FederatedModuleWrapper({ Component }) {
  const parentClient = useApolloClient();

  return (
    <ApolloProvider client={parentClient}>
      <Component />
    </ApolloProvider>
  );
}

// Protected route component that checks authentication
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    // Listen for custom auth events from login/signup components
    const handleAuthSuccess = () => {
      const userData = localStorage.getItem("user");
      setIsLoggedIn(true);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    window.addEventListener("auth_login", handleAuthSuccess);

    return () => {
      window.removeEventListener("auth_login", handleAuthSuccess);
    };
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      <Navbar bg="white" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand className="fw-bold">
            <span className="text-primary">Micro</span>Frontend App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="mx-2">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/community" className="mx-2">
                Community
              </Nav.Link>

              {isLoggedIn ? (
                <>
                  <Nav.Link className="mx-2 text-muted">Hi, {user?.username || "User"}</Nav.Link>
                  <Nav.Link onClick={handleLogout} className="mx-2 text-danger">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link as={Link} to="/auth" className="mx-2">
                  Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="main-content">
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/auth/*" element={<FederatedModuleWrapper Component={Auth} />} />
            <Route
              path="/community/*"
              element={
                <ProtectedRoute>
                  <FederatedModuleWrapper Component={Community} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} user={user} />} />
          </Routes>
        </Suspense>
      </Container>
    </div>
  );
}

function HomePage({ isLoggedIn, user }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
      <div className="text-center">
        <h1 className="mb-4 fw-bold">Welcome{isLoggedIn ? `, ${user?.username || "User"}` : ""}</h1>
        <p className="mb-4">
          {isLoggedIn
            ? "Access your community dashboard to get started."
            : "Access your community dashboard or authenticate to get started."}
        </p>

        {isLoggedIn ? (
          <Button variant="primary" size="lg" className="px-5 py-3 shadow" onClick={() => navigate("/community")}>
            Go to Community
          </Button>
        ) : (
          <Button variant="primary" size="lg" className="px-5 py-3 shadow" onClick={() => navigate("/auth")}>
            Login / Sign up
          </Button>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
