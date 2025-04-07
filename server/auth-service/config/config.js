import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Configuration for auth-service
export const config = {
    db: process.env.AUTH_MONGO_URI || 'mongodb+srv://appuser:27131013576691@comp229.vr7csru.mongodb.net/COMP308LAB-4', // ✅ MongoDB URI for Auth Microservice
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret', // ✅ JWT secret for signing and verifying tokens
    port: process.env.AUTH_PORT || 4001, // ✅ Port for Auth Microservice
};

// Log in development mode (only prints in development)
if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 JWT_SECRET in auth-service config: ${config.JWT_SECRET}`);
    console.log(`🚀 Auth Microservice running on port: ${config.port}`);
}
