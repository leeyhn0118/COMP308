import mongoose from 'mongoose';

const helpRequestSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Ensure this matches the name of the User model
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        default: '' 
    },
    isResolved: { 
        type: Boolean, 
        default: false 
    },
    volunteers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date 
    }
}, { timestamps: true });


const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

export default HelpRequest;

