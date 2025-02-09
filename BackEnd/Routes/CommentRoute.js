import express from 'express'
import { addComment, commentCount, deleteComment, getAllComments, getComments } from '../Controllers/CommentController.js';
import { authenticate } from '../Middleware/authenticate.js';
const CommentRoute = express.Router();
CommentRoute.post('/add', authenticate ,addComment);
CommentRoute.get('/get-comments/:blogid',getComments);
CommentRoute.get('/get-count/:blogid',commentCount);
CommentRoute.get('/get-all-comment',authenticate,getAllComments);
CommentRoute.delete('/delete/:commendId',authenticate,deleteComment);

export default CommentRoute;