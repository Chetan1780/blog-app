import express from 'express';
import { like, likeCount } from '../Controllers/LikeController.js';
import { authenticate, optionalAuthenticate } from '../Middleware/authenticate.js';
const LikeRoute = express.Router();
LikeRoute.post('/toggleLike',authenticate,like);
LikeRoute.get('/get-like/:blogid', optionalAuthenticate, likeCount);
export default LikeRoute;
