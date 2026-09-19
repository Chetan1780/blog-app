import jwt from 'jsonwebtoken'
import {handleError} from "../Helper/handleError.js"
import User from '../models/usermodel.js';

const verifySession = (token) => jwt.verify(token, process.env.JWT_SECRET, {
    issuer: process.env.JWT_ISSUER || 'blog-api',
    audience: process.env.JWT_AUDIENCE || 'blog-web',
});

export const authenticate = async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token){
            return next(handleError(401,'Authentication is required.'));
        }
        const decodedToken = verifySession(token);
        const user = await User.findById(decodedToken.sub).select('_id name email avatar role status');
        if (!user || user.status !== 'active') {
            return next(handleError(401, 'Your session is no longer active.'));
        }
        req.user = user;
        next();
        
    } catch (error) {
        next(handleError(401,'Your session is invalid or has expired.'));
    }
}

export const optionalAuthenticate = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next();
    try {
        const decodedToken = verifySession(token);
        const user = await User.findById(decodedToken.sub).select('_id name email avatar role status');
        if (user?.status === 'active') req.user = user;
    } catch {
        // Public endpoints remain available when an old browser cookie has expired.
    }
    next();
};
