import jwt from 'jsonwebtoken'
import { handleError } from '../Helper/handleError.js';
export const authenticateadmin = async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        // console.log(token);
        if(!token){
            return next(handleError(403,'Unauthorized acesss 1'));
        }
        const decodetoken = jwt.verify(token,process.env.JWT_SECRET);
        if(decodetoken.role === 'admin'){
            req.user = decodetoken;
            next();
        } else{
            return next(403,'Unauthorized acesss 2');
        }
        
    } catch (error) {
        next(handleError(500,error.message));
    }
}