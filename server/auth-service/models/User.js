import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        required: true,
        enum: ['resident', 'business_owner', 'community_organizer'] // Allowed roles
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
export default mongoose.model('User', userSchema);