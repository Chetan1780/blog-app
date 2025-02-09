import jwt from 'jsonwebtoken'
import {handleError} from "../Helper/handleError.js"
export const authenticate = async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token){
            return next(handleError(403,'Unauthorized acesss'));
        }
        const decodetoken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodetoken;
        next();
        
    } catch (error) {
        next(handleError(500,error.message));
    }
}