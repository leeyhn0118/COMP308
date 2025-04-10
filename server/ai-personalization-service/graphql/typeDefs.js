import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type AIResponse {
        text: String!
        suggestedQuestions: [String!]!
        retrievedPosts: [String!]!
    }

    type EventTimingSuggestion {
        day: String!
        hour: Int!
    }

    type Query {
        communityAIQuery(input: String!, userId: String!): AIResponse!
    }

    type Mutation {
        analyzeReviewSentiment(reviewId: ID!): String!
        matchVolunteersForHelpRequest(helpRequestId: ID!, userId: String!): [String!]!
        recommendBestEventTiming: EventTimingSuggestion!
    }
`;

export default typeDefs;
