// UserInteraction.js - model for MongoDB
import mongoose from 'mongoose';
const UserInteractionSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Associate interactions with users
    query: { type: String, required: true }, // User's question
    aiResponse: { type: String, required: true }, // AI's answer
    createdAt: { type: Date, default: Date.now } // Timestamp of interaction
});
const UserInteraction = mongoose.model('UserInteraction', UserInteractionSchema);
export default UserInteraction;