import express from 'express';
import { like, likeCount } from '../Controllers/LikeController.js';
import { authenticate } from '../Middleware/authenticate.js';
const LikeRoute = express.Router();
LikeRoute.post('/toggleLike',authenticate,like);
LikeRoute.get('/get-like/:blogid/:userid',likeCount);
LikeRoute.get('/get-like/:blogid',likeCount);
export default LikeRoute;