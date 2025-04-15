import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4000/graphql", // Gateway GraphQL endpoint
    credentials: "include" // Enable cookies to be sent
  }),
  cache: new InMemoryCache()
});

export default client;
