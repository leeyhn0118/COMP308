import { gql } from 'apollo-server-express';

const typeDefs = gql`
    # User Type - Represents the User in the system
    type User {
        id: ID!
        username: String
        email: String!
        role: String!
        createdAt: String!
    }

    # Community Post Type - Represents a community post
    type CommunityPost {
        id: ID!
        author: User
        title: String!
        content: String!
        category: String!
        aiSummary: String
        createdAt: String!
        updatedAt: String
    }

    # Help Request Type - Represents a help request from the community
    type HelpRequest {
        id: ID!
        author: User
        description: String!
        location: String
        isResolved: Boolean!
        volunteers: [User]
        createdAt: String!
        updatedAt: String
    }

    # AIResponse type returned by the communityAIQuery
    type AIResponse {
        text: String!
        suggestedQuestions: [String!]!
        retrievedPosts: [CommunityPost!]!
    }

    # Query to retrieve the community posts and help requests
    type Query {
        getAllCommunityPosts: [CommunityPost!]!
        getCommunityPost(id: ID!): CommunityPost
        getAllHelpRequests: [HelpRequest!]!
        getHelpRequest(id: ID!): HelpRequest

        # AI-powered community query
        communityAIQuery(input: String!, userId: String!): AIResponse!
    }

    # Mutations for creating, updating, and deleting community posts and help requests
    type Mutation {
        createCommunityPost(
            title: String!
            content: String!
            category: String!
            aiSummary: String
        ): CommunityPost!

        updateCommunityPost(
            id: ID!
            title: String
            content: String
            category: String
            aiSummary: String
        ): CommunityPost!

        deleteCommunityPost(id: ID!): Boolean!

        createHelpRequest(
            description: String!
            location: String
        ): HelpRequest!

        updateHelpRequest(
            id: ID!
            description: String
            location: String
            isResolved: Boolean
        ): HelpRequest!

        deleteHelpRequest(id: ID!): Boolean!
    }
`;

export default typeDefs;
