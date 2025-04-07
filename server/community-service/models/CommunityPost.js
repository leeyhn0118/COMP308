import mongoose from 'mongoose';

// Define the Community Post schema
const communityPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['news', 'discussion'] // Allowed values for category
    },
    aiSummary: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
}, { timestamps: true });

// Create the Community Post model
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

export default CommunityPost;
