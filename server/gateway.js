import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      // Vite development URLs
      "http://localhost:5173",
      "http://localhost:5174",
      // React development URLs
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      // Apollo Studio
      "https://studio.apollographql.com"
    ],
    credentials: true
  })
);
app.use(cookieParser());

// Custom data source class that passes cookies/headers to the subgraphs
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Pass JWT token from cookie or header to services
    if (context.token) {
      request.http.headers.set("authorization", `Bearer ${context.token}`);
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "auth", url: "http://localhost:4001/graphql" },
      { name: "community", url: "http://localhost:4002/graphql" },
      { name: "business", url: "http://localhost:4003/graphql" },
      { name: "ai", url: "http://localhost:4004/graphql" }
    ]
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  }
});

const server = new ApolloServer({
  gateway,
  introspection: true
});

async function startServer() {
  try {
    await server.start();

    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const tokenFromCookie = req.cookies?.token;
          const authHeader = req.headers.authorization;
          const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
          const token = tokenFromCookie || tokenFromHeader;

          return { token };
        }
      })
    );

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Gateway running at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Failed to start the gateway server:", error);
    process.exit(1);
  }
}

startServer();
