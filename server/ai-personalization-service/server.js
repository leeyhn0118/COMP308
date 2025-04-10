import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';

import connectDB from './config/mongoose.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import { config } from './config/config.js';

connectDB();

const app = express();

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.json());

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
    schema,
    introspection: true,
});

async function startServer() {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => {
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            let user = null;

            if (token) {
                try {
                    user = jwt.verify(token, config.JWT_SECRET);
                } catch (err) {
                    console.error('Token verification failed', err);
                }
            }

            return { user };
        }
    }));

    app.listen(config.port, () =>
        console.log(`🚀 AI-Personalization-Service running at http://localhost:${config.port}/graphql`)
    );
}

startServer();
