import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Configuration for community-service
export const config = {
    db: process.env.COMMUNITY_MONGO_URI || 'mongodb+srv://appuser:27131013576691@comp229.vr7csru.mongodb.net/COMP308LAB-4', // MongoDB URI for community-service
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret', // Shared JWT secret (same as auth-service)
    port: process.env.COMMUNITY_PORT || 4002, // Port for the community service
};

// Log in development mode to show the configurations
if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 JWT_SECRET in community-service config: ${config.JWT_SECRET}`);
    console.log(`🚀 Community Microservice running on port: ${config.port}`);
}
