import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Configuration for community-service
export const config = {
    db: process.env.COMMUNITY_MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    port: process.env.COMMUNITY_PORT || 4002, 
};

// Log in development mode to show the configurations
if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 JWT_SECRET in community-service config: ${config.JWT_SECRET}`);
    console.log(`🚀 Community Microservice running on port: ${config.port}`);
}
