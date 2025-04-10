import dotenv from 'dotenv';
dotenv.config();

import EmbeddedPost from '../models/EmbeddedPost.js';
import UserInteraction from '../models/UserInteraction.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';
import { generateEmbedding } from '../utils/embedding.js';
import { fetchUserProfile } from '../utils/fetchUserProfile.js';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
  maxOutputTokens: 2048,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const retrieveData = async (query) => {
  const queryEmbedding = await generateEmbedding(query);
  const allPosts = await EmbeddedPost.find();
  return allPosts
    .map(post => ({ post, similarity: cosineSimilarity(queryEmbedding, post.embedding) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
    .map(p => p.post.content);
};
const generateFollowUpQuestions = (query, aiResponse) => {
    const suggestions = [];
    if (/safety|crime|security/i.test(query) || /suspicious|concerns/.test(aiResponse)) {
        suggestions.push(
            "Would you like to see statistics on crime rates?",
            "Are there community-led initiatives addressing this?"
        );
    }
    if (/solutions|ideas|plans/i.test(query) || /recommendations|proposedsolutions/i.test(aiResponse)) {
        suggestions.push(
            "What solutions have been effective in similar communities?",
            "Are there any government-led safety programs?"
        );
    }
    if (/budget|funding|money|cost of living|rent|affordable housing/i.test(query) ||
        /financial support|grants|housing options|eviction/i.test(aiResponse)) {
        suggestions.push(
            "How is this initiative being funded?",
            "Do you need help finding affordable housing?"
        );
    }
    if (/transportation|transit|bus|subway|commute/i.test(query) || /publictransit | route | schedule | accessibility/i.test(aiResponse)) {
        suggestions.push(
            "Would you like to view local transit schedules?",
            "Do you want tips for commuting or discounted transit passes?"
        );
    }
    if (suggestions.length === 0) {
        suggestions.push("What more would you like to know?", "Would you like updates on this topic ? ");
}
    return suggestions;
};


const resolvers = {
    Query: {
      communityAIQuery: async (_, { input, userId }) => {
        const pastInteractions = await UserInteraction.find({ userId }).sort({ createdAt: -1 }).limit(3);
        const pastContext = pastInteractions
          .map(i => `User: "${i.query}", AI: "${i.aiResponse}"`).join("\n");
        const retrievedPosts = await retrieveData(input);
  
        const augmentedQuery = `
          User Query: ${input}
          Past Interactions: ${pastContext}
          Relevant Discussions: ${retrievedPosts.join("\n")}
        `;
  
        const response = await model.invoke([["human", augmentedQuery]]);
        const aiResponseText = response.content;
  
        await UserInteraction.create({ userId, query: input, aiResponse: aiResponseText });
  
        return {
          text: aiResponseText,
          suggestedQuestions: generateFollowUpQuestions(input, aiResponseText),
          retrievedPosts,
        };
      },
    },
  
    Mutation: {
      analyzeReviewSentiment: async (_, { reviewContent }) => {
        const sentimentPrompt = `Analyze sentiment (positive, neutral, negative):\n\n${reviewContent}`;
        const response = await model.invoke(sentimentPrompt);
        return response.content.trim().toLowerCase();
      },
  
      matchVolunteersForHelpRequest: async (_, { helpRequestId, userId }) => {
        const helpReqRes = await axios.post('http://localhost:4002/graphql', {
          query: `query { getHelpRequest(id:"${helpRequestId}") { description, location } }`
        });
        const helpRequest = helpReqRes.data.data.getHelpRequest;
        const user = await fetchUserProfile(userId);
        if (!user || !helpRequest) return [];
  
        const usersRes = await axios.get("http://localhost:4001/users");
        return usersRes.data.filter(u =>
          u.role === 'resident' &&
          u.location === helpRequest.location &&
          u.interests.some(i => user.interests.includes(i))
        ).map(u => u.id);
      },
  
      recommendBestEventTiming: async () => {
        const eventRes = await axios.post('http://localhost:4003/graphql', {
          query: `{ getAllEvents { startTime } }`
        });
        const events = eventRes.data.data.getAllEvents;
        if (!events.length) return { day: 'Friday', hour: 18 };
  
        const counts = {};
        events.forEach(event => {
          const date = new Date(event.startTime);
          const key = `${date.toLocaleString('en-US', { weekday: 'long' })}-${date.getHours()}`;
          counts[key] = (counts[key] || 0) + 1;
        });
  
        const [bestDayHour] = Object.entries(counts).sort(([,a], [,b]) => b - a)[0];
        const [day, hour] = bestDayHour.split('-');
        return { day, hour: parseInt(hour) };
      },
    },
  };
  
  export default resolvers;