import Category from '../models/CategoryModel.js'
import cloudinary from "../Config/cloudinary.js";
import { handleError } from "../Helper/handleError.js";
import Blog from "../models/BlogModel.js";
import {encode} from 'entities';
export const addBlog = async (req,res,next)=>{
    try {
        const data = JSON.parse(req.body.data);
        // console.log(data);
        
        let temp;
        if(req.file){
            // console.log(req.file);
            const uploadResult = await cloudinary.uploader
            .upload(
                req.file.path,
                {
                    folder:'blog-images',
                    resource_type:'auto'
                }
            ).catch((error)=>{
                next(handleError(500,error.message));
            });
            temp = uploadResult.secure_url;
        }
        const blog = new Blog({
            author:data.author,
            category:data.category,
            title:data.title,
            slug:data.slug,
            featuredImage:temp,
            content: encode(data.content)
        })
        await blog.save();
        res.status(200).json({
            success:true,
            message:"Added Successfully!!"
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const editBlog = async (req,res,next)=>{
    try {
        const data = JSON.parse(req.body.data);
        // console
        const blog = Blog.findById(data._id)
        if(req.file){

        }
        
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const updateBlog = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        const data = JSON.parse(req.body.data);
        const blog = await Blog.findById(blogid);
        // console.log(data);
        
        let temp;
        if(req.file){
            // console.log(req.file);
            const uploadResult = await cloudinary.uploader
            .upload(
                req.file.path,
                {
                    folder:'blog-images',
                    resource_type:'auto'
                }
            ).catch((error)=>{
                next(handleError(500,error.message));
            });
            blog.featuredImage = uploadResult.secure_url;
        }
        blog.category = data.category
        blog.title=data.title,
        blog.slug=data.slug,
        blog.content=encode(data.content)
    
        await blog.save();
        res.status(200).json({
            success:true,
            message:"Updated Successfully!!"
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const showBlog = async (req,res,next)=>{
    const {blogid} = req.params;
    const blog = await Blog.findById(blogid);
    if(!blog) next(handleError(404,"Data not found!!"));
    res.status(200).json({
        blog
    });
}
export const deleteBlog = async (req,res,next)=>{
    try {
        const {blogid} = req.params;
        // console.log(blogid);
        const data = await Blog.findByIdAndDelete(blogid)
        res.status(200).json({
            success:true,
            message:"Blog Deleted SuccessFully!!"
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const allBlog = async (req,res,next)=>{
    try {
        let id;
        let blog;
        // console.log(req.user);
        if(req.user && req.user.role==='admin'){
            blog = await Blog.find().populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        } else if(req.user && req.user.role==='user'){
            blog = await Blog.find({author: req.user._id}).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        } else{
            blog = await Blog.find().populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const getBlog = async (req,res,next)=>{
    try {
        const {slug} = req.params;
        const blog = await Blog.findOne({ slug }).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const getRelatedBlog = async (req,res,next)=>{
    try {
        const {category,currBlog} = req.params;
        const categoryData = await Category.findOne({slug:category})
        if(!categoryData){
            return next(handleError(404,'Category data not found!!'))
        }
        const blog = await Blog.find({ category:categoryData._id,slug:{$ne:currBlog}}).lean().exec();
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const getBlogBycategory = async (req,res,next)=>{
    try {
        const {category} = req.params;
        const categoryData = await Category.findOne({slug:category})
        if(!categoryData){
            return next(handleError(404,'Category data not found!!'))
        }
        const blog = await Blog.find({ category:categoryData._id}).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        res.status(200).json({
            blog,
            categoryData
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const search = async (req,res,next)=>{
    try {
        const {q} = req.query;
        const blog = await Blog.find({ title:{$regex:q,$options:'i'}}).populate('author','name avatar role ').populate('category','name slug').sort({createdAt:-1}).lean().exec();
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}