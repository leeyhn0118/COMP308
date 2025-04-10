import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Business {
    id: ID!
    ownerId: ID!
    name: String!
    description: String
    image: String
    category: String
    createdAt: String!
  }

  type Deal {
    id: ID!
    businessId: ID!
    title: String!
    description: String
    discount: Float!
    expiresAt: String
    createdAt: String!
  }

  type Review {
    id: ID!
    businessId: ID!
    reviewerId: ID!
    content: String!
    rating: Int!
    createdAt: String!
  }

  type Comment {
    id: ID!
    reviewId: ID!
    authorId: ID!
    content: String!
    createdAt: String!
    updatedAt: String
  }

  type Query {
    getAllBusinesses: [Business!]!
    getBusinessById(id: ID!): Business

    getDealsByBusiness(businessId: ID!): [Deal!]!
    getReviewsByBusiness(businessId: ID!): [Review!]!
    getCommentsByReview(reviewId: ID!): [Comment!]!
  }

  type Mutation {
    createBusiness(
      name: String!
      description: String
      image: String
      category: String
    ): Business!

    updateBusiness(
      id: ID!
      name: String
      description: String
      image: String
      category: String
    ): Business!

    deleteBusiness(id: ID!): Boolean!

    createDeal(
      businessId: ID!
      title: String!
      description: String
      discount: Float!
      expiresAt: String
    ): Deal!

    deleteDeal(id: ID!): Boolean!

    createReview(
      businessId: ID!
      content: String!
      rating: Int!
    ): Review!

    deleteReview(id: ID!): Boolean!

    createComment(reviewId: ID!, content: String!): Comment!
    updateComment(id: ID!, content: String!): Comment!
    deleteComment(id: ID!): Boolean!
  }
`;

export default typeDefs;