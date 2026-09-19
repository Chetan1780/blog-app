import mongoose from "mongoose";
const BlogSchema = new mongoose.Schema({
   author:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
   },
   category:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Category'
   },
    title: { type: String, required: true, trim: true },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    content:{type:String,required:true,trim:true},
    excerpt: { type: String, trim: true, maxlength: 320 },
    tags: [{ type: String, trim: true, lowercase: true }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1, min: 1 },
    viewCount: { type: Number, default: 0, min: 0 },
    featuredImage:{
        type:String,
        required:true,
        trim:true
    },
    featuredImageAlt: { type: String, trim: true, maxlength: 180 }
},{timestamps:true})
BlogSchema.index({ status: 1, publishedAt: -1 });
BlogSchema.index({ category: 1, status: 1, publishedAt: -1 });
const Blog = mongoose.model('Blog', BlogSchema, 'blogs');
export default Blog;
