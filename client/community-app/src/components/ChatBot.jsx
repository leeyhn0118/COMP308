import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Container, Card, Form, InputGroup, Button, Spinner, ButtonGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Correct GraphQL syntax using backticks
const COMMUNITY_AI_QUERY = gql`
  query CommunityAIQuery($input: String!, $userId: String!) {
    communityAIQuery(input: $input, userId: $userId) {
      text
      suggestedQuestions
      retrievedPosts {
        id
        title
        content
      }
    }
  }
`;

const userId = "test-user-123"; // Replace with real user authentication later

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const [getAIResponse] = useLazyQuery(COMMUNITY_AI_QUERY, {
    onCompleted: (data) => {
      setConversation((prev) => [
        ...prev,
        {
          role: "AI",
          content: data.communityAIQuery.text,
          suggestedQuestions: data.communityAIQuery.suggestedQuestions,
          retrievedPosts: data.communityAIQuery.retrievedPosts,
        },
      ]);
      setIsTyping(false);
    },
    onError: (err) => {
      console.error("GraphQL Error:", err.message);
      setConversation((prev) => [
        ...prev,
        {
          role: "AI",
          content: "Oops! Something went wrong while fetching the response.",
        },
      ]);
      setIsTyping(false);
    },
  });

  const sendQuery = (inputQuery) => {
    if (!inputQuery.trim()) return;
    setConversation((prev) => [...prev, { role: "User", content: inputQuery }]);
    setQuery("");
    setIsTyping(true);
    getAIResponse({ variables: { input: inputQuery, userId } });
  };

  const handleFollowUpClick = (question) => {
    sendQuery(question);
  };

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h3 className="text-center">Community AI Chatbot</h3>

      <Card className="shadow-lg p-3" style={{ width: "80%", maxWidth: "600px", height: "450px" }}>
        <Card.Body
          style={{
            overflowY: "auto",
            height: "360px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                message.role === "User" ? "bg-primary text-white" : "bg-light text-dark"
              }`}
              style={{
                alignSelf: message.role === "User" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                borderRadius: "15px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <strong>{message.role}: </strong> {message.content}
              {message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                <div className="mt-2">
                  <strong>Suggested Follow-ups:</strong>
                  <ButtonGroup className="d-flex flex-wrap mt-2">
                    {message.suggestedQuestions.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline-success"
                        size="sm"
                        className="m-1"
                        style={{
                          borderRadius: "20px",
                          fontSize: "0.85rem",
                          padding: "5px 10px",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                        onClick={() => handleFollowUpClick(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              )}

              {message.retrievedPosts && message.retrievedPosts.length > 0 && (
                <div className="mt-2">
                  <strong>Related Posts:</strong>
                  <ul className="mt-1">
                    {message.retrievedPosts.map((post) => (
                      <li key={post.id}>
                        <strong>{post.title}</strong>: {post.content.slice(0, 80)}...
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="text-muted d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              AI is typing...
            </div>
          )}
        </Card.Body>
      </Card>

      <InputGroup className="mt-3" style={{ width: "80%", maxWidth: "600px" }}>
        <Form.Control
          type="text"
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendQuery(query)}
        />
        <Button variant="primary" onClick={() => sendQuery(query)}>
          Send
        </Button>
      </InputGroup>
    </Container>
  );
};

export default Chatbot;
