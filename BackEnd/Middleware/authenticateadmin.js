import { handleError } from '../Helper/handleError.js';
export const authenticateadmin = async (req,res,next)=>{
    if (req.user?.role === 'admin') return next();
    return next(handleError(403, 'Administrator access is required.'));
}
