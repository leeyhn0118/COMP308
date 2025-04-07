import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4002/graphql',  // Community Service GraphQL API URL
    credentials: 'include',  // Allow credentials (cookies or tokens)
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token in headers
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
