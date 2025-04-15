import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:4001/graphql", // Auth Service GraphQL endpoint (instead of gateway)
    credentials: "include" // Enable cookies to be sent
  }),
  cache: new InMemoryCache()
});

export default client;
