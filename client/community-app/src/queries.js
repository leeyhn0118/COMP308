// src/graphql/queries.js
import { gql } from '@apollo/client';

// Query to get all community posts
export const GET_COMMUNITY_POSTS = gql`
  query GetCommunityPosts {
    getAllCommunityPosts {
      id
      title
      content
      category
      aiSummary
      createdAt
      author {
        username
      }
    }
  }
`;

export const GET_HELP_REQUESTS = gql`
  query GetHelpRequests {
    getAllHelpRequests {
      id
      description
      location
      isResolved
      createdAt
      updatedAt
      author {
        username
      }
    }
  }
`;


// Mutation to create a new community post
export const CREATE_COMMUNITY_POST = gql`
  mutation CreateCommunityPost($title: String!, $content: String!, $category: String!, $aiSummary: String) {
    createCommunityPost(title: $title, content: $content, category: $category, aiSummary: $aiSummary) {
      id
      title
      content
      category
      aiSummary
    }
  }
`;

// Mutation to create a new help request
export const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id
      description
      location
    }
  }
`;

