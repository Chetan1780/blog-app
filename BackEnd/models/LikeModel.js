import mongoose from "mongoose";
const LikeSchema = new mongoose.Schema({
    userid:{
         type: mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'User'
    },
    blogid:{
         type: mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'Blog'
    },

},{timestamps:true})
const Likes = mongoose.model('Like',LikeSchema,'likes');
export default Likes;