import { gql } from "apollo-server-express";

const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@shareable"])

  type AIResponse {
    text: String!
    suggestedQuestions: [String!]!
    retrievedPosts: [String!]!
  }

  type EventTimingSuggestion @shareable {
    day: String! @shareable
    hour: Int! @shareable
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
