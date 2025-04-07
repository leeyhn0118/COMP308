import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        role: String!
        createdAt: String!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        currentUser: User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, role: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
    }
`;

export default typeDefs;