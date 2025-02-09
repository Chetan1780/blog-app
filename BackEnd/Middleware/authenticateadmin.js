import jwt from 'jsonwebtoken'
export const authenticateadmin = async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token){
            return next(403,'Unauthorized acesss');
        }
        const decodetoken = jwt.verify(token,process.env.JWT_SECRET);
        if(decodetoken.role === 'admin'){
            req.user = decodetoken;
            next();
        } else{
            return next(403,'Unauthorized acesss');
        }
        
    } catch (error) {
        next(500,error.message)
    }
}