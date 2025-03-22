import {handleError}  from "../Helper/handleError.js";
import Comment from "../models/CommentModel.js"
import Blog from "../models/BlogModel.js";
export const addComment = async (req,res,next)=>{
    try {
        const {user,blogid,comment} = req.body;
        const newComment = new Comment({
            user,
            blogid,
            comment
        });
        await newComment.save();
        res.status(200).json({
            success:true,
            message:'Comment submitted!!',
            comment: newComment
        })

    } catch (error) {
        next(handleError(500,error.message));
    }
} 
export const getComments = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        const comments = await Comment.find({blogid}).populate('user','name avatar').sort({createdAt:-1}).lean().exec();
        res.status(200).json({
            comments
        })

    } catch (error) {
        next(handleError(500,error.message));
    }
} 
export const commentCount = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        const count = await Comment.countDocuments({blogid})
        res.status(200).json({
            count
        })
        
    } catch (error) {
        next(handleError(500,error.message));
    }
} 

export const getAllComments = async (req,res,next)=>{
    try {
        const user = req.user;
        let comments;
        const blogs = await Blog.find({author:user._id});
        const blogIds = blogs.map(blog => blog._id);
        if(user && user.role==='admin'){
            comments = await Comment.find().populate('blogid', 'title slug category').populate('user','name').lean().exec();;
        } else{
            comments = await Comment.find({ blogid: { $in: blogIds } })
            .populate('blogid', 'title slug category') 
            .populate('user', 'name')   
            .lean()
            .exec();
        }
        res.status(200).json({
            comments
        })

    } catch (error) {
        next(handleError(500,error.message));
    }
} 
export const deleteComment = async (req,res,next)=>{
    try {
        const {commendId} = req.params;
        (commendId);
        
        await Comment.findByIdAndDelete(commendId)
        res.status(200).json({
            success:true,
            message:"Comment Deleted!!"
        })

    } catch (error) {
        next(handleError(500,error.message));
    }
} 