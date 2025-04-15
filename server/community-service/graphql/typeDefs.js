import { gql } from "apollo-server-express";

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

  type EmergencyAlert {
    id: ID!
    author: User
    title: String!
    message: String!
    location: String!
    isResolved: Boolean!
    createdAt: String!
    updatedAt: String
  }

  type Subscription {
    emergencyAlertCreated: EmergencyAlert!
  }

  type Event {
    id: ID!
    title: String!
    description: String
    location: String
    startTime: String!
    endTime: String!
    organizerId: ID!
    attendees: [ID!]!
    createdAt: String!
    updatedAt: String
  }

  type EventTimingSuggestion {
    day: String!
    hour: Int!
  }

  # Query to retrieve the community posts and help requests
  type Query {
    getAllCommunityPosts: [CommunityPost!]!
    getCommunityPost(id: ID!): CommunityPost
    getAllHelpRequests: [HelpRequest!]!
    getHelpRequest(id: ID!): HelpRequest

    getAllEmergencyAlerts: [EmergencyAlert!]
    getEmergencyAlert(id: ID!): EmergencyAlert

    matchVolunteers(helpRequestId: ID!): [User!]!

    getAllEvents: [Event!]!
    getEventById(id: ID!): Event
  }

  # Mutations for creating, updating, and deleting community posts and help requests
  type Mutation {
    createCommunityPost(title: String!, content: String!, category: String!, aiSummary: String): CommunityPost!

    updateCommunityPost(id: ID!, title: String, content: String, category: String, aiSummary: String): CommunityPost!

    deleteCommunityPost(id: ID!): Boolean!

    createHelpRequest(description: String!, location: String): HelpRequest!

    updateHelpRequest(id: ID!, description: String, location: String, isResolved: Boolean): HelpRequest!

    deleteHelpRequest(id: ID!): Boolean!

    createEmergencyAlert(title: String!, message: String!, location: String!): EmergencyAlert

    updateEmergencyAlert(
      id: ID!
      title: String
      message: String
      location: String
      isResolved: Boolean
    ): EmergencyAlert!

    deleteEmergencyAlert(id: ID!): Boolean!

    createEvent(title: String!, description: String, location: String, startTime: String!, endTime: String!): Event!

    updateEvent(
      id: ID!
      title: String
      description: String
      location: String
      startTime: String
      endTime: String
    ): Event!

    deleteEvent(id: ID!): Boolean!

    joinEvent(id: ID!): Event!
    leaveEvent(id: ID!): Event!
  }
`;

export default typeDefs;
