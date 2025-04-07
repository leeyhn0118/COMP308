// server/microservices/auth-service/server.js

// Import required modules
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // Load environment variables
import { config } from './config/config.js'; // Configuration file
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js'; // MongoDB connection
import typeDefs from './graphql/typeDefs.js'; // GraphQL type definitions
import resolvers from './graphql/resolvers.js'; // GraphQL resolvers

// Log JWT_SECRET in development mode for debugging
console.log("🔍 JWT_SECRET in auth-service:", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();

// Enable CORS with the appropriate origins (adjust based on your client-side URLs)
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000', 'https://studio.apollographql.com'],
    credentials: true, // Allow cookies to be sent with requests
}));

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Remove the parse() function. Use typeDefs directly.
const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

// Initialize ApolloServer
const server = new ApolloServer({
    schema,
    introspection: true, // Allow introspection (can be disabled in production)
});

// Function to start the server
async function startServer() {
    await server.start();

    // Apply the Apollo GraphQL middleware and set the path to /graphql
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            // Extract JWT token from cookies or Authorization header
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let user = null;

            if (token) {
                try {
                    // Verify the token using JWT_SECRET
                    const decoded = jwt.verify(token, config.JWT_SECRET);
                    user = { username: decoded.username }; // Add user to context
                } catch (error) {
                    console.error("Error verifying token:", error);
                }
            }

            // Return the user and response objects to the context
            return { user, res };
        }
    }));

    // Start the Express server
    app.listen(config.port, () => console.log(`🚀 Auth Microservice running at http://localhost:${config.port}/graphql`));
}

// Start the server
startServer();
