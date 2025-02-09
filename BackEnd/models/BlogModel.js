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
    featuredImage:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})
const Blog = mongoose.model('Blog', BlogSchema, 'blogs');
export default Blog;