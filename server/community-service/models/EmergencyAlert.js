import mongoose, { mongo, Mongoose } from 'mongoose'

const EmergencyAlertSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
      },
      location: {
        type: String,
        required: true
      },
      isResolved: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date
      }
    }, { timestamps: true });
    
    const EmergencyAlert = mongoose.model('EmergencyAlert', EmergencyAlertSchema);
    
    export default EmergencyAlert;