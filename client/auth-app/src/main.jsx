import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter> {/* Only wrap your app in BrowserRouter here */}
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
