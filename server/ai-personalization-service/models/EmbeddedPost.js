import mongoose from 'mongoose';

const EmbeddedPostSchema = new mongoose.Schema({
  content: String,
  embedding: [Number],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('EmbeddedPost', EmbeddedPostSchema);
