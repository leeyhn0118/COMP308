import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  location: String,
  image: String, 
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

export default Business;
