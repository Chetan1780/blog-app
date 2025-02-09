import { handleError } from "../Helper/handleError.js";
import Category from '../models/CategoryModel.js'
// add 
export const addCategory = async (req,res,next)=>{
    try {
        console.log(req.body.name,req.body.slug);
        const {name,slug} = req.body;
        const category = new Category({name,slug});
        await category.save();
        res.status(200).json({
            success:true,
            message:'Category added successfully!!'
        });
    } catch (error) {
        next(handleError(500,error.message))   
    }
}
// delete
export const deleteCategory = async (req,res,next)=>{
    try {
        const {categoryid} = req.params;
        const data = await Category.findByIdAndDelete(categoryid);
        res.status(200).json({
            success:true,
            message:"Category deleted successfully!!"
        }) 
    } catch (error) {
        next(handleError(500,error.message))   
    }
    
}
// edit 
export const updateCategory = async (req,res,next)=>{
    try {
        const {name,slug} = req.body;
        const {categoryid} = req.params;
        const category = await Category.findByIdAndUpdate(categoryid,{
            name,slug
        },{new:true});
        res.status(200).json({
            success:true,
            message:'Category Updated successfully!!'
        });
    } catch (error) {
        next(handleError(500,error.message))   
    }
    
}
// show
export const showCategory = async (req,res,next)=>{
    try {
        const {categoryid} = req.params;
        const data = await Category.findById(categoryid);
        if(!data){
            next(handleError(404,'Data not found!!'))
        }
        res.status(200).json({
            data
        }) 
    } catch (error) {
        next(handleError(500,error.message))   
    }
    
}
export const getAllCategory = async (req,res,next)=>{
    try {
        const category = await Category.find().sort({name:1}).lean().exec();
        res.status(200).json({
            category
        })
    } catch (error) {
        next(handleError(500,error.message))   
    }
    
}