import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles if needed
import App from './App';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client'; // Import Apollo client and ApolloProvider
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

// Create Apollo Client instance
const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4002/graphql', // Backend URL for GraphQL
    credentials: 'include', // Allow credentials like cookies or tokens
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}> {/* Provide Apollo Client to the entire app */}
      <BrowserRouter> {/* Wrap the entire app in BrowserRouter */}
        <App /> {/* App component */}
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
