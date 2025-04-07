import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
//
import { GoogleGenerativeAI } from '@google/generative-ai';
console.log(process.env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResponse = await model.embedContent({
      content: {
        parts: [{ text }],
        role: "user",
      },
    });
    if (!embeddingResponse.embedding) throw new Error("No embedding generated");
    return embeddingResponse.embedding.values;
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}
