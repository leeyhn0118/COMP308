import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import EmbeddedPost from './models/EmbeddedPost.js';
import { generateEmbedding } from './utils/embedding.js';

mongoose.connect(process.env.MONGO_URI);

const seedPosts = async () => {
    const loader = new TextLoader('./data/community_posts.txt');
    const docs = await loader.load();
    for (const doc of docs) {
        const sentences = doc.pageContent.split(/\r?\n/).filter(Boolean);
        for (const sentence of sentences) {
            const embedding = await generateEmbedding(sentence);
            const post = new EmbeddedPost({ content: sentence, embedding });
            await post.save();
        }
    }
    console.log('✅ Seeded embedded posts!');
    mongoose.disconnect();
};

seedPosts();
