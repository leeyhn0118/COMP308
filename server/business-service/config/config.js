import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Configuration for business-service
export const config = {
    db: process.env.BUSINESS_MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    port: process.env.BUSINESS_PORT || 4003,
};

// Log in development mode (only prints in development)
if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 JWT_SECRET in auth-service config: ${config.JWT_SECRET}`);
    console.log(`🚀 Auth Microservice running on port: ${config.port}`);
}
