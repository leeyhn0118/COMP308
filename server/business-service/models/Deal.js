import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  discount: {
    type: Number, 
    default: 0
  },
  validUntil: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
