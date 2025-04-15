import { gql } from "apollo-server-express";

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@shareable"])

  type User @key(fields: "id") {
    id: ID!
    username: String! @shareable
    email: String! @shareable
    role: String! @shareable
    interests: [String]
    location: String
    createdAt: String! @shareable
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    currentUser: User
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String!
      interests: [String]
      location: String!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

export default typeDefs;
