// server/microservices/community-service/server.js

// Import required modules
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Load environment variables

import { config } from "./config/config.js"; // Configuration file
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";

import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "./ws/useServer.js";
import _ from "lodash";

import connectDB from "./config/mongoose.js"; // MongoDB connection
import typeDefs from "./graphql/typeDefs.js"; // GraphQL type definitions
import resolvers from "./graphql/resolvers.js"; // Core resolvers
import emergencyResolvers from "./graphql/emergencyResolvers.js";
import eventResolvers from "./graphql/eventResolvers.js";

// Log JWT_SECRET in development mode for debugging
console.log("🔍 JWT_SECRET in community-service:", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

// Create an Express app
const app = express();

// Enable CORS with the appropriate origins (adjust based on your client-side URLs)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:4000",
      "https://studio.apollographql.com",
      "https://sandbox.embed.apollographql.com",
    ],
    credentials: true, // Allow cookies to be sent with requests
  }),
);

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:4000",
    "https://studio.apollographql.com",
    "https://sandbox.embed.apollographql.com",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Merge core and AI resolvers
const mergedResolvers = _.merge(
  {},
  resolvers,
  emergencyResolvers,
  eventResolvers,
);

// ✅ Build schema using merged resolvers
const schema = buildSubgraphSchema([{ typeDefs, resolvers: mergedResolvers }]);

const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

// Initialize ApolloServer
const server = new ApolloServer({
  schema,
  introspection: true, // Allow introspection (can be disabled in production)
});

// Function to start the server
async function startServer() {
  await server.start();

  useServer(
    {
      schema,
      context: async (ctx, msg, args) => {
        const token = ctx.connectionParams?.authorization?.split(" ")[1];
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            user = {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
              location: decoded.location,
            };
            console.log("✅ WS Connection user:", user);
          } catch (err) {
            console.error("WebSocket token error:", err);
          }
        }

        return { user };
      },
    },
    wsServer,
  );
  // Apply the Apollo GraphQL middleware and set the path to /graphql
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token =
          req.cookies.token || req.headers.authorization?.split(" ")[1];
        let user = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            user = {
              id: decoded.id,
              username: decoded.username,
              role: decoded.role,
              location: decoded.location,
            };
          } catch (error) {
            console.error("Error verifying token:", error);
          }
        }

        return { user, res };
      },
    }),
  );

  // Start the Express server
  httpServer.listen(config.port, () => {
    console.log(`🚀 HTTP ready at http://localhost:${config.port}/graphql`);
    console.log(`📡 WebSocket ready at ws://localhost:${config.port}/graphql`);
  });
}

// Start the server
startServer();
