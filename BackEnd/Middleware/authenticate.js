import jwt from 'jsonwebtoken'
export const authenticate = async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token){
            return next(403,'Unauthorized acesss');
        }
        const decodetoken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodetoken;
        next();
        
    } catch (error) {
        next(500,error.message)
    }
}