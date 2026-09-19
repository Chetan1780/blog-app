import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'author', 'editor', 'admin'],
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'suspended'],
        required: true,
        trim: true
    },
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    password: { type: String, select: false },
    lastLoginAt: { type: Date }
},{timestamps:true})
userSchema.index({ status: 1, createdAt: -1 });
const User = mongoose.model('User', userSchema, 'users');
export default User;
