import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4001/graphql', // Authentication Microservice GraphQL endpoint
    credentials: 'include', // Enable cookies to be sent
  }),
  cache: new InMemoryCache(),
});

export default client;
