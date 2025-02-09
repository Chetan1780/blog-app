//register
import {handleError} from "../Helper/handleError.js"
import User from "../models/usermodel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const Register = async(req,res,next)=>{
    try{
        const {name,email,password} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            next(handleError(409,'User already registered!!'))
        }
        const hashedPassword = bcryptjs.hashSync(password);
        const user = new User({
            name,email,password:hashedPassword
        });
        await user.save();
        res.status(200).json({
            success:true,
            message:'Registration successfull!!'
        })
    } catch(err){
        next(handleError(500,err.message));
    }
}
//login
export const Login = async(req,res,next)=>{  
    try {
        const {email,password} = req.body;
        const getUser = await User.findOne({email});
        if(!getUser){
            next(handleError(404,'Invalid Login Credentials!!'))
        }
        const hashedPassword = getUser.password;
        const comparePassword = bcryptjs.compare(password,hashedPassword);
        if(!comparePassword){
            next(handleError(404,'Invalid Login Credentials!!'))
        }
        const token = jwt.sign({
            _id: getUser._id,
            name:getUser.name,
            email:getUser.email,
            avatar:getUser.avatar,
            role:getUser.role,
        }, process.env.JWT_SECRET);
        res.cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV === 'production'?'none':'strict',
            path:'/'
        });
        const newUser = getUser.toObject({getters:true});
        delete newUser.password;
        res.status(200).json({
            success:true,
            user:newUser,
            message:'Login SuccessFull'
        })
    } catch (err) {
        next(handleError(500,err.message));
    }
}
export const GoogleLogin = async(req,res,next)=>{  
    try {
        const {name,email,avatar} = req.body;
        let user;
        user = await User.findOne({email});
        if(!user){
            const password = Math.random().toString();
            const hashedPassword = bcryptjs.hashSync(password)
            const newUser = new User({
                name,email,password:hashedPassword,avatar
            })
            user = await newUser.save();
        }
        const token = jwt.sign({
            _id: user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role
        }, process.env.JWT_SECRET);
        
        res.cookie('access_token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV === 'production'?'none':'strict',
            path:'/'
        });
        const newUser = user.toObject({getters:true});
        delete newUser.password;
        res.status(200).json({
            success:true,
            user:newUser,
            message:'Login SuccessFull'
        })
    } catch (err) {
        next(handleError(500,err.message));
    }
}
export const Logout = async(req,res,next)=>{  
    try {
        res.clearCookie('access_token',{
            httpOnly:true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV === 'production'?'none':'strict',
            path:'/'
        });
        res.status(200).json({
            success:true,
            message:'LogOut SuccessFull'
        })
    } catch (err) {
        next(handleError(500,err.message));
    }
}
