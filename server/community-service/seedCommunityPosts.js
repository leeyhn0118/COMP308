//seedCommunityPosts.js
// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import CommunityPost from './models/CommunityPost.js';
import { generateEmbedding } from './utils/embedding.js';
//
mongoose.connect(process.env.MONGO_URI);
//
const seedPosts = async () => {
    const loader = new TextLoader('./data/community_posts.txt');
    const docs = await loader.load();
    for (const doc of docs) {
        const sentences = doc.pageContent.split(/\r?\n/).filter(line => line.trim());
        for (const sentence of sentences) {
            const embedding = await generateEmbedding(sentence);
            const post = new CommunityPost({
                author: '000000000000000000000000', // Replace with real ObjectId
                title: sentence.substring(0, 40) + '...',
                content: sentence,
                category: 'discussion',
                embedding,
            });
            await post.save();
        }
    }
    console.log('✅ Seeded community posts!');
    mongoose.disconnect();
};
//
seedPosts();