import cloudinary from "../Config/cloudinary.js";
import { handleError } from "../Helper/handleError.js";
import User from "../models/usermodel.js";
import bcryptjs from 'bcryptjs';
import Blog from "../models/BlogModel.js";
export const getUser = async (req,res,next)=>{
    try {
        const {userId} = req.params;
        const user = await User.findOne({_id:userId}).lean().exec();
        if(!user){
            next(handleError(404,'User Not Found!!'));
        }
        res.status(200).json({
            success:true,
            message:"User data Found!!",
            user
        })
    } catch (error) {
        next(handleError(500,error.message))
    }
}
export const updateUser = async (req,res,next)=>{
    try {
        const data = JSON.parse(req.body.data);
        const {userId} = req.params;
        const user = await User.findById(userId);
        user.name = data.name;
        user.email = data.email;
        user.bio = data.bio;
        if(data.password && data.password.length>0){
            const hashedPassword = bcryptjs.hashSync(data.password);
            user.password = hashedPassword;
        }
        if(req.file){
            console.log(req.file);
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
            user.avatar = uploadResult.secure_url;
        }
        await user.save();
        const newUser = user.toObject({getters:true});
        delete newUser.password;
        res.status(200).json({
            success:true,
            user:newUser,
            message:'User data updated!!'
        })
    } catch (error) {
        next(handleError(500,error.message));
    }
}
export const getAllUsers = async (req,res,next)=>{
    try {
        const users = await User.find()
        res.status(200).json({
            users
        })
    } catch (error) {
        next(handleError(500,error.message))
    }
}
export const deleteUser = async (req, res, next) => {
    const { userid } = req.params;

    try {
        
        // await Comment.deleteMany({ user: userid });
        // const blogs = await Blog.find({ author: userid });
        // const blogIds = blogs.map(blog => blog._id);
        // await Comment.deleteMany({ blogid: { $in: blogIds } });
        // await Blog.deleteMany({ author: userid });
        await User.findByIdAndDelete(userid);
        res.status(200).json({
            success: true,
            message: "User, their blogs, and all related comments have been deleted successfully!"
        });
    } catch (error) {
        next(handleError(500, 'Error deleting user, blogs, and related comments', error.message));
    }
};
