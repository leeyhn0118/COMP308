// resolvers.js - contains the GraphQL resolvers for the Agentic AI Server.
import dotenv from 'dotenv';
dotenv.config();
import CommunityPost from '../models/CommunityPost.js';
import UserInteraction from '../models/UserInteraction.js';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    maxOutputTokens: 2048,
});
// Generate embedding using Gemini
const generateEmbedding = async (text) => {
    try {
        const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
        const embeddingResponse = await embeddingModel.embedContent({
            content: {
                parts: [{ text }],
                role: 'user',
            },
        });
        if (!embeddingResponse.embedding) throw new Error('No embedding generated');
        return embeddingResponse.embedding.values;
    } catch (error) {
        console.error('Error generating embeddings with Gemini:', error);
        throw new Error('Failed to generate embedding');
    }
};
// Retrieve relevant discussions using vector similarity
const retrieveData = async (query) => {
    const queryEmbedding = await generateEmbedding(query);
    const allPosts = await CommunityPost.find({ embedding: { $exists: true, $ne: [] } });
    const rankedPosts = allPosts
        .map((post) => ({
            post,
            similarity: cosineSimilarity(queryEmbedding, post.embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    return rankedPosts.map((p) => p.post.content);
};
// Function to generate dynamic follow-up questions
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
// Resolver implementation
const resolvers = {
    Query: {
        communityAIQuery: async (_, { input, userId }) => {
            try {
                const pastInteractions = await UserInteraction.find({ userId })
                    .sort({ createdAt: -1 })
                    .limit(3);
                const pastContext = pastInteractions
                    .map((i) => `User asked: "${i.query}", AI responded: "${i.aiResponse}"`)
                    .join("\n");
                const retrievedPosts = await retrieveData(input);
                const retrievedData = retrievedPosts.join("\n");
                const augmentedQuery = `User Query: ${input}\n\nPrevious
Interactions:\n${pastContext}\n\nCommunity Discussions:\n${retrievedData}`;
                const response = await model.invoke([["human", augmentedQuery]]);
                const aiResponseText = response.content;
                await new UserInteraction({
                    userId,
                    query: input,
                    aiResponse: aiResponseText,
                }).save();
                const suggestedQuestions = generateFollowUpQuestions(input, aiResponseText);
                return {
                    text: aiResponseText,
                    suggestedQuestions,
                    retrievedPosts,
                };
            } catch (error) {
                console.error('Error during AI query processing:', error);
                return {
                    text: 'An error occurred while processing your request.',
                    suggestedQuestions: [],
                    retrievedPosts: [],
                };
            }
        },
    },
};
export default resolvers;