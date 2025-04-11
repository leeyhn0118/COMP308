import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

const app = express();
app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(cookieParser());

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'auth', url: 'http://localhost:4001/graphql' },
      { name: 'community', url: 'http://localhost:4002/graphql' },
      { name: 'business', url: 'http://localhost:4003/graphql' },
      { name: 'ai', url: 'http://localhost:4004/graphql' },
    ],
  }),
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        if (context.token) {
          request.http.headers.set('authorization', `Bearer ${context.token}`);
        }
      }
    });
  },
});

const server = new ApolloServer({
  gateway,
  introspection: true,
});

async function startServer() {
  await server.start();

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    const tokenFromCookie = req.cookies?.token;
    const authHeader = req.headers.authorization; 
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromCookie || tokenFromHeader;


    return { token };
  },
}));

  app.listen(4000, () => {
    console.log(`🚀 Gateway running at http://localhost:4000/graphql`);
  });
}

startServer();
